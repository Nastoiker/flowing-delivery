import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
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

  async createOrder(order: any) {
    const orderCreated = await this.orderModel.create({
      ...order,
    });
    if (!orderCreated) {
      throw new Error('Ошибка создания заказа');
    }
    return orderCreated;
  }
  async createFoodForOrder(shoppingCarts: ShoppingCart[], orderId: number) {
    for (const item of shoppingCarts) {
      const food = await this.foodModel.findByPk(item.productId);
      if (food.in_stock < item.count || food.count < item.count) {
        throw new Error(
          'Извините, но у нас нет такого количество товара. Измените количестов'
        );
      }
      await Promise.all([
        food.update({
          in_stock: food.in_stock - item.count,
          count: food.count - item.count,
        }),
        this.orderFoodModel.create({
          orderId,
          foodId: item.productId,
          quantity: item.count, // Передаем количество из корзины
        }),
      ]);
    }
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
