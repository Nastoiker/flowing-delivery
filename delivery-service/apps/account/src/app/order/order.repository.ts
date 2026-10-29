import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op, Transaction } from 'sequelize';
import { Food } from '../food/models/food.model';
import { Rating } from '../rating/rating.model';
import { ShoppingCart } from '../shopping-cart/model/shopping-cart.model';
import { User } from '../user/models/user.model';
import { OrderFood } from './order-food.model';
import { Order } from './order.model';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(OrderFood)
    private readonly orderFoodModel: typeof OrderFood,
    @InjectModel(Food)
    private readonly foodModel: typeof Food
  ) {}

  async createOrder(order: Partial<Order>, transaction: Transaction) {
    const orderCreated = await this.orderModel.create(
      { ...order },
      { transaction }
    );
    if (!orderCreated) {
      throw new Error('Ошибка создания заказа');
    }
    return orderCreated;
  }
  async createFoodForOrder(
    shoppingCarts: ShoppingCart[],
    orderId: number,
    transaction: Transaction
  ): Promise<number> {
    let totalMinor = 0;
    // Единый порядок захвата товарных строк уменьшает риск взаимных блокировок:
    // корзины [A, B] и [B, A] обе блокируют A, затем B.
    const sorted = [...shoppingCarts].sort((a, b) => a.productId - b.productId);
    for (const item of sorted) {
      if (!Number.isSafeInteger(item.count) || item.count <= 0) {
        throw new Error(
          'Количество товара должно быть положительным целым числом'
        );
      }
      const food = await this.foodModel.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!food) throw new Error('Товар больше не существует');
      // PostgreSQL не поддерживает UNSIGNED: пометка ORM не заменяет
      // проверку данных и будущие CHECK-ограничения в миграции.
      if (
        !Number.isSafeInteger(food.count) ||
        food.count < 0 ||
        !Number.isSafeInteger(food.in_stock) ||
        food.in_stock < 0
      ) {
        throw new Error('Некорректный остаток товара');
      }
      // FOR UPDATE удерживается до конца общей транзакции. Конкурентный заказ
      // ждёт, затем при READ COMMITTED читает уже обновлённый остаток.
      if (food.in_stock < item.count || food.count < item.count) {
        throw new Error('Недостаточно товара для оформления заказа');
      }
      const unitMinor = Math.round(food.price * 100);
      const lineMinor = unitMinor * item.count;
      if (
        !Number.isFinite(food.price) ||
        food.price < 0 ||
        !Number.isSafeInteger(unitMinor) ||
        !Number.isSafeInteger(lineMinor) ||
        !Number.isSafeInteger(totalMinor + lineMinor)
      ) {
        throw new Error('Некорректная цена товара');
      }
      totalMinor += lineMinor;
      // Не запускаем запросы одной транзакции через Promise.all: они используют
      // одно соединение, а последовательность делает точку ошибки понятной.
      await food.update(
        {
          in_stock: food.in_stock - item.count,
          count: food.count - item.count,
        },
        { transaction }
      );
      await this.orderFoodModel.create(
        {
          orderId,
          foodId: item.productId,
          quantity: item.count,
        },
        { transaction }
      );
    }
    return totalMinor;
  }

  async setTotals(
    order: Order,
    priceFood: number,
    totalPrice: number,
    transaction: Transaction
  ) {
    return order.update({ priceFood, totalPrice }, { transaction });
  }
  async updateOrder({ id, ...rest }) {
    const order = await this.orderModel.findByPk(id);
    if (!order) {
      throw new Error('не найдено');
    }
    await order.update({
      ...rest,
    });

    return order;
  }

  async findAllOrders({ sort, filter, page, pageSize }) {
    const { field = 'createdAt', direction = 'desc' } = sort || {};
    const { minPrice, maxPrice, userId, isPickUp, status } = filter;
    const offset = (page - 1) * pageSize;
    const where = { completed: false } as any;

    if (minPrice !== undefined)
      where.totalPrice = { ...where.totalPrice, [Op.gte]: minPrice };
    if (maxPrice !== undefined)
      where.totalPrice = { ...where.totalPrice, [Op.lte]: maxPrice };

    if (status !== undefined) where.status = status;
    if (userId !== undefined) where.userId = status;

    if (isPickUp !== undefined) where.isPickUp = isPickUp;
    const allCount = await this.orderModel.count({
      where,
    });
    const data = await this.orderModel.findAll({
      order: [[field, direction]],
      where,
      offset,
      limit: pageSize,
      include: [
        {
          model: User,
        },
        {
          model: Food,
        },
      ],
    });
    return { data, allCount };
  }
  async findMyPendingOrders({ userId, sort }) {
    const { field = 'createdAt', direction = 'desc' } = sort || {};

    const orders = await this.orderModel.findAll({
      order: [[field, direction]],
      where: {
        userId: userId,
        completed: false,
      },
      include: [
        {
          model: Food,
          include: [
            {
              model: Rating,
            },
          ],
        },
      ],
    });
    return { orders };
  }
  async findMyPurchasedOrders({ userId, sort }) {
    const { field = 'createdAt', direction = 'desc' } = sort || {};

    const { rows: orders, count } = await this.orderModel.findAndCountAll({
      order: [[field, direction]],
      where: {
        completed: true,
        userId,
      },
      include: [
        {
          model: Food,
        },
      ],
    });
    return { orders, allCount: count };
  }
  async deleteOrder(id: number) {
    const order = await this.orderModel.findOne({ where: { id } });
    await order.destroy();
  }
  async update(id: number, orderDto) {
    const order = this.orderModel.findByPk(id);
    if (!order) {
      throw new Error('Ошибка, коммент не найден');
    }
    return (await order).update(orderDto);
  }
  async findOrder(id: number) {
    const order = await this.orderModel.findOne({
      where: { id },
      include: [
        {
          model: User,
        },
        {
          model: Food,
          through: {
            attributes: ['quantity'],
          },
        },
      ],
    });
    if (!order) {
      throw new Error('Заказ не найден');
    }
    return order;
  }
}
