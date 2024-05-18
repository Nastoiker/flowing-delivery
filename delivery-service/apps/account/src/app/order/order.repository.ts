import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Food } from '../food/models/food.model';
import { User } from '../user/models/user.model';
import { Order } from './order.model';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order
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

  async updateOrder({ id, ...rest }: Order) {
    const order = await this.orderModel.update(
      {
        ...rest,
      },
      {
        where: {
          id,
        },
      }
    );

    return order;
  }

  async findAllOrders({ sort, filter, page, pageSize }) {
    const { field = 'createdAt', direction = 'desc' } = sort || {};
    const { minPrice, maxPrice, userId, isPickUp, status } = filter;
    const offset = (page - 1) * pageSize;
    const where = {} as any;

    if (minPrice !== undefined)
      where.totalPrice = { ...where.totalPrice, [Op.gte]: minPrice };
    if (maxPrice !== undefined)
      where.totalPrice = { ...where.totalPrice, [Op.lte]: maxPrice };

    if (status !== undefined) where.status = status;
    if (userId !== undefined) where.userId = status;

    if (isPickUp !== undefined) where.isPickUp = isPickUp;
    const allCount = await this.orderModel.count({
      where,
      include: [
        {
          model: User,
        },
        {
          model: Food,
        },
      ],
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

  async deleteOrder(id: number) {
    const order = await this.orderModel.findOne({ where: { id } });
    await order.destroy();
  }
}
