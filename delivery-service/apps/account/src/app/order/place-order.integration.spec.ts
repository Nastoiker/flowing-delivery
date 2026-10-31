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
import { SequelizeCheckout } from './infrastructure/sequelize-checkout';
import { ChangeOrderStatus } from './application/change-order-status';
import { SequelizeOrderStatus } from './infrastructure/sequelize-order-status';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
        new SequelizeCheckout(db, carts, Order, OrderFood, Food)
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

    it('демодамп импортируется повторно без дублей и сброса остатков', async () => {
      const sql = readFileSync(resolve(__dirname, '../../../../../../deploy/server/demo.sql'), 'utf8');
      await db.query('DROP TABLE IF EXISTS demo_imports');
      try {
        await db.query(sql);
        const demoFoods = await Food.findAll();
        expect(demoFoods).toHaveLength(5);
        expect(await Order.count()).toBe(5);
        expect(await OrderFood.count()).toBe(5);
        expect(await User.count()).toBe(1);
        expect((await User.findOne()).password).toBe('!LOGIN_DISABLED!');
        await demoFoods[0].update({ in_stock: 3 });
        await db.query(sql);
        expect(await Food.count()).toBe(5);
        expect(await Order.count()).toBe(5);
        expect((await Food.findByPk(demoFoods[0].id)).in_stock).toBe(3);
        const line = await OrderFood.findOne();
        const food = await Food.findByPk(line.foodId);
        expect(Number(line.unitPriceMinor)).toBe(food.price * 100);
      } finally {
        await db.query('DROP TABLE IF EXISTS demo_imports');
      }
    });

    it('обновляет остатки старого демодампа один раз, не затрагивая другие товары', async () => {
      const sql = readFileSync(resolve(__dirname, '../../../../../../deploy/server/demo.sql'), 'utf8');
      await db.query('DROP TABLE IF EXISTS demo_imports');
      try {
        await db.query(sql);
        const demo = await Food.findOne({ where: { title: 'Демо: лимонад' } });
        expect(demo.count).toBe(demo.in_stock);
        // Reproduce the earlier v1 import without the stock migration marker.
        await demo.update({ count: 0, in_stock: 30 });
        await db.query("DELETE FROM demo_imports WHERE version = 'catalog-stock-v2'");
        const unrelated = await Food.create({ title: 'Обычный товар', price: 100, count: 0, in_stock: 8 });
        const depleted = await Food.findOne({ where: { title: 'Демо: чизкейк' } });
        await depleted.update({ count: 0, in_stock: 0 });

        await db.query(sql);
        await demo.reload();
        expect(demo.count).toBe(30);
        expect(demo.in_stock).toBe(30);
        expect((await unrelated.reload()).count).toBe(0);
        expect((await depleted.reload()).count).toBe(0);
        expect(depleted.in_stock).toBe(0);

        // Re-import must not restore stock even when only one counter is empty.
        await demo.update({ count: 0, in_stock: 2 });
        await db.query(sql);
        await demo.reload();
        expect(demo.count).toBe(0);
        expect(demo.in_stock).toBe(2);
        expect(await Food.count()).toBe(6);
        expect(await Order.count()).toBe(5);
      } finally {
        await db.query('DROP TABLE IF EXISTS demo_imports');
      }
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

    it('сохраняет цену и название покупки после изменения каталога', async () => {
      const buyer = await user('snapshot');
      const product = await food(3, 125.5);
      await add(buyer.id, product.id, 2);
      const { order } = await service.execute(command(buyer.id));
      await product.update({ title: 'Новое название', price: 999 });
      const line = await OrderFood.findOne();
      expect(line.unitPriceMinor).toBe('12550');
      expect(line.productTitle).toBe('Тестовое блюдо');
      const view = await new OrderRepository(Order).findOrder(order.id);
      expect(view.products[0].title).toBe('Тестовое блюдо');
      expect(view.products[0].price).toBe(125.5);
      expect(view.totalPrice).toBe(261);
      expect(view.allowedStatuses).toEqual(['created', 'confirmed']);
    });

    it('миграция оставляет исторические снимки неизвестными и применяется повторно', async () => {
      const buyer = await user('historical');
      const product = await food(2);
      await add(buyer.id, product.id);
      await service.execute(command(buyer.id));
      await db.query(
        'ALTER TABLE "OrderFoods" DROP COLUMN "productTitle", DROP COLUMN "unitPriceMinor"'
      );
      const sql = readFileSync(
        resolve(
          __dirname,
          '../../../../../migrations/002-order-line-snapshots.sql'
        ),
        'utf8'
      );
      await db.query(sql);
      await db.query(sql);
      const historical = await OrderFood.findOne();
      expect(historical.productTitle).toBeNull();
      expect(historical.unitPriceMinor).toBeNull();
      expect(historical.quantity).toBe(1);
    });

    it('не округляет дробные копейки и не оставляет изменений', async () => {
      const buyer = await user('fraction');
      const product = await food(2, 1.001);
      await add(buyer.id, product.id);
      await expect(service.execute(command(buyer.id))).rejects.toThrow(
        'двух знаков'
      );
      expect(await Order.count()).toBe(0);
      expect((await product.reload()).count).toBe(2);
      expect(await ShoppingCart.count()).toBe(1);
    });

    it('конкурентные команды статуса не обходят переходы и не меняют деньги', async () => {
      const buyer = await user('progress');
      const product = await food(3);
      await add(buyer.id, product.id);
      const { order } = await service.execute(command(buyer.id));
      const change = new ChangeOrderStatus(new SequelizeOrderStatus(Order));
      const confirm = { id: order.id, status: 'confirmed' };
      await Promise.all([change.execute(confirm), change.execute(confirm)]);
      await expect(
        change.execute({ id: order.id, status: 'received' })
      ).rejects.toThrow('Недопустимый');
      const tampered = {
        id: order.id,
        status: 'delivery',
        totalPrice: 0,
        isPaid: true,
        completed: true,
        userId: 99,
      };
      await expect(change.execute(tampered)).rejects.toThrow('только id');
      const before = await Order.findByPk(order.id);
      expect(before.status).toBe('confirmed');
      expect(before.isPaid).toBe(false);
      expect(before.completed).toBe(false);
      expect(before.userId).toBe(buyer.id);
      expect(before.totalPrice).toBe(135.5);
      await change.execute({ id: order.id, status: 'delivery' });
      await change.execute({ id: order.id, status: 'received' });
      const stored = await Order.findByPk(order.id);
      expect(stored.completed).toBe(true);
      await expect(change.execute(confirm)).rejects.toThrow('Недопустимый');
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
