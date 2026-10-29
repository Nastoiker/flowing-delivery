import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { orderView } from './infrastructure/order-view';
import { Food } from '../food/models/food.model';
import { Rating } from '../rating/rating.model';
import { User } from '../user/models/user.model';
import { Order } from './order.model';

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order) private readonly orderModel: typeof Order) {}

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
    if (userId !== undefined) where.userId = userId;

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
    return { data: data.map(orderView), allCount };
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
    return { orders: orders.map(orderView) };
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
    return { orders: orders.map(orderView), allCount: count };
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
            attributes: ['quantity', 'productTitle', 'unitPriceMinor'],
          },
        },
      ],
    });
    if (!order) {
      throw new Error('Заказ не найден');
    }
    return orderView(order);
  }
}
