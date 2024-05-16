import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

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

  async findAllOrders() {
    return this.orderModel.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Food,
        },
      ],
    });
  }

  async deleteOrder(id: number) {
    const order = await this.orderModel.findOne({ where: { id } });
    await order.destroy();
  }
}
