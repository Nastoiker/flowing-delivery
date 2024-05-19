import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Food } from '../food/models/food.model';
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
    private readonly orderFoodModel: typeof OrderFood
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
      await this.orderFoodModel.create({
        orderId,
        foodId: item.productId,
        quantity: item.count, // Передаем количество из корзины
      });
    }
  }
  async updateOrder({ id, ...rest }) {
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
