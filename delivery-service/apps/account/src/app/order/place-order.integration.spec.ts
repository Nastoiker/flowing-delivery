import 'reflect-metadata';
import { OrderCreate } from '@delivery-service/contracts';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Category } from '../category/model/category.model';
import { Comment } from '../comments/comment.model';
import { LikeComment } from '../comments/likeComment.model';
import { Food } from '../food/models/food.model';
import { Purchase } from '../purchase/purchase.model';
import { Rating } from '../rating/rating.model';
import { ShoppingCart } from '../shopping-cart/model/shopping-cart.model';
import { ShoppingCartRepository } from '../shopping-cart/repositories/Shopping-cart.repositories';
import { User } from '../user/models/user.model';
import { OrderFood } from './order-food.model';
import { Order } from './order.model';
import { OrderRepository } from './order.repository';
import { PlaceOrderService } from './place-order.service';

const databaseUrl = process.env.TRANSACTION_TEST_DATABASE_URL;
// Обычный запуск unit-тестов не требует PostgreSQL. Специальный npm-скрипт
// ниже отдельно проверяет наличие URL, чтобы отсутствие БД не давало ложный успех.
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase(
  'Оформление заказа: реальные транзакции PostgreSQL',
  () => {
    let db: Sequelize;
    let service: PlaceOrderService;
    let carts: ShoppingCartRepository;

    beforeAll(async () => {
      const url = new URL(databaseUrl);
      if (
        !['localhost', '127.0.0.1'].includes(url.hostname) ||
        url.pathname !== '/delivery_transactions_test'
      ) {
        throw new Error(
          'Тесты разрешены только в локальной delivery_transactions_test'
        );
      }
      db = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: false,
        pool: { max: 8, min: 0 },
        dialectOptions: {
          application_name: 'delivery-transaction-tests',
          statement_timeout: 15000,
        },
        models: [
          User,
          Food,
          Category,
          ShoppingCart,
          Order,
          OrderFood,
          Purchase,
          Rating,
          Comment,
          LikeComment,
        ],
      });
      // Удаление таблиц разрешено только после проверки имени одноразовой БД.
      await db.sync({ force: true });
      carts = new ShoppingCartRepository(ShoppingCart, Food);
      service = new PlaceOrderService(
        db,
        new OrderRepository(Order, OrderFood, Food),
        carts
      );
    }, 30000);

    beforeEach(async () => {
      jest.restoreAllMocks();
      // Имена таблиц берём из моделей: Sequelize считает Food неисчисляемым
      // словом и не обязательно использует ожидаемое вручную имя Foods.
      await db.truncate({ cascade: true, restartIdentity: true });
    });

    afterAll(async () => {
      if (db) await db.close();
    });

    const user = (name: string) =>
      User.create({
        email: name + '@example.test',
        name,
        surname: 'Test',
        username: name,
        password: 'test-placeholder',
        roles: 2,
      });
    const food = (count: number, price = 125.5) =>
      Food.create({ title: 'Тестовое блюдо', price, count, in_stock: count });
    const add = (userId: number, productId: number, count = 1) =>
      ShoppingCart.create({ userId, productId, count, totalPrice: 1 });
    const command = (userId: number): OrderCreate.Request => ({
      userId,
      status: 'received',
      deliveryPrice: 10,
      priceFood: 1,
      totalPrice: 1,
      deliveryAddress: 'Тестовый адрес',
      isPickUp: false,
    });

    it('фиксирует заказ, остатки и корзину вместе; сумму блюд берёт из БД', async () => {
      const buyer = await user('buyer');
      const product = await food(3);
      await add(buyer.id, product.id, 2);
      const { order } = await service.execute(command(buyer.id));
      const stored = await Order.findByPk(order.id);
      expect(stored.status).toBe('created');
      expect(stored.priceFood).toBe(251);
      expect(stored.totalPrice).toBe(261);
      expect(stored.isPaid).toBe(false);
      expect(stored.completed).toBe(false);
      expect(stored.deliveryAddress).toBe('Тестовый адрес');
      expect((await product.reload()).count).toBe(1);
      expect(product.in_stock).toBe(1);
      expect(await ShoppingCart.count()).toBe(0);
      expect((await OrderFood.findOne()).quantity).toBe(2);
    });

    it('откатывает первое списание и заказ, если второго товара недостаточно', async () => {
      const buyer = await user('buyer');
      const first = await food(3);
      const second = await food(0);
      await add(buyer.id, first.id);
      await add(buyer.id, second.id);
      await expect(service.execute(command(buyer.id))).rejects.toThrow(
        'Недостаточно'
      );
      expect(await Order.count()).toBe(0);
      expect(await OrderFood.count()).toBe(0);
      expect((await first.reload()).count).toBe(3);
      expect(first.in_stock).toBe(3);
      expect(await ShoppingCart.count()).toBe(2);
    });

    it('откатывает даже уже выполненную очистку корзины при позднем сбое', async () => {
      const buyer = await user('buyer');
      const product = await food(2);
      await add(buyer.id, product.id);
      const remove = carts.removeCheckedOut.bind(carts);
      // Внедряем сбой после настоящего DELETE, а не подменяем поведение PostgreSQL.
      jest
        .spyOn(carts, 'removeCheckedOut')
        .mockImplementation(async (...args) => {
          await remove(...args);
          throw new Error('Учебный сбой перед COMMIT');
        });
      await expect(service.execute(command(buyer.id))).rejects.toThrow(
        'Учебный сбой'
      );
      expect(await Order.count()).toBe(0);
      expect(await OrderFood.count()).toBe(0);
      expect(await ShoppingCart.count()).toBe(1);
      expect((await product.reload()).count).toBe(2);
      expect(product.in_stock).toBe(2);
    });

    it.each([0, -1])(
      'отклоняет недопустимое количество %s без частичных записей',
      async (count) => {
        const buyer = await user('buyer');
        const product = await food(3);
        await add(buyer.id, product.id, count);
        await expect(service.execute(command(buyer.id))).rejects.toThrow(
          'положительным целым'
        );
        expect(await Order.count()).toBe(0);
        expect((await product.reload()).count).toBe(3);
        expect(await ShoppingCart.count()).toBe(1);
      }
    );

    it('не превращает NULL в нулевой остаток при списании', async () => {
      const buyer = await user('buyer');
      const product = await food(3);
      await product.update({ in_stock: null });
      await add(buyer.id, product.id);
      await expect(service.execute(command(buyer.id))).rejects.toThrow(
        'Некорректный остаток'
      );
      expect(await Order.count()).toBe(0);
      expect((await product.reload()).count).toBe(3);
      expect(await ShoppingCart.count()).toBe(1);
    });

    it('отклоняет пустую корзину без создания заказа', async () => {
      const buyer = await user('buyer');
      await expect(service.execute(command(buyer.id))).rejects.toThrow(
        'Корзина пуста'
      );
      expect(await Order.count()).toBe(0);
    });

    it('не удаляет новую позицию, добавленную после чтения оформляемой корзины', async () => {
      const buyer = await user('buyer');
      const oldProduct = await food(2);
      const newProduct = await food(2);
      await add(buyer.id, oldProduct.id);
      const remove = carts.removeCheckedOut.bind(carts);
      jest
        .spyOn(carts, 'removeCheckedOut')
        .mockImplementation(async (...args) => {
          // Независимая операция вне транзакции оформления.
          await add(buyer.id, newProduct.id);
          return remove(...args);
        });
      await service.execute(command(buyer.id));
      const remaining = await ShoppingCart.findAll();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].productId).toBe(newProduct.id);
    });

    it('не оформляет одну корзину дважды при двух конкурентных запросах', async () => {
      const buyer = await user('buyer');
      const product = await food(5);
      await add(buyer.id, product.id);
      const results = await Promise.allSettled([
        service.execute(command(buyer.id)),
        service.execute(command(buyer.id)),
      ]);
      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
      expect(results.filter((r) => r.status === 'rejected')).toHaveLength(1);
      expect(await Order.count()).toBe(1);
      expect((await product.reload()).count).toBe(4);
    });

    it('два покупателя последней единицы: оба ждут блокировку, успешен один', async () => {
      const a = await user('a');
      const b = await user('b');
      const product = await food(1);
      await add(a.id, product.id);
      await add(b.id, product.id);
      const blocker = await db.transaction();
      await Food.findByPk(product.id, {
        transaction: blocker,
        lock: blocker.LOCK.UPDATE,
      });
      // Отдельное соединение удерживает товар, чтобы проверить реальное
      // пересечение запросов, а не случайное последовательное выполнение.
      const resultPromise = Promise.allSettled([
        service.execute(command(a.id)),
        service.execute(command(b.id)),
      ]);
      let observedTwoWaiters = false;
      try {
        for (let attempt = 0; attempt < 100; attempt++) {
          const [row] = await db.query<{ count: string }>(
            "SELECT count(*) FROM pg_stat_activity WHERE datname = current_database() AND application_name = 'delivery-transaction-tests' AND wait_event_type = 'Lock'",
            { type: QueryTypes.SELECT }
          );
          if (Number(row.count) >= 2) {
            observedTwoWaiters = true;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } finally {
        await blocker.rollback();
      }
      const results = await resultPromise;
      expect(observedTwoWaiters).toBe(true);
      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
      expect(results.filter((r) => r.status === 'rejected')).toHaveLength(1);
      expect(await Order.count()).toBe(1);
      expect(await OrderFood.count()).toBe(1);
      expect(await ShoppingCart.count()).toBe(1);
      expect((await product.reload()).count).toBe(0);
      expect(product.in_stock).toBe(0);
    }, 20000);
  }
);
