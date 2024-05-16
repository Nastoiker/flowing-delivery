import { OrderCreate, OrderGetAll } from '@delivery-service/contracts';
import { Body, Controller, Query } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { OrderRepository } from './order.repository';

@Controller()
export class OrderQueries {
  constructor(private readonly orderRepository: OrderRepository) {}

  @RMQValidate()
  @RMQRoute(OrderGetAll.topic)
  async getOrders(@Query() query: any): Promise<OrderGetAll.Response> {
    const orders = await this.orderRepository.findAllOrders();
    return {
      orders,
    };
  }

  @RMQValidate()
  @RMQRoute(OrderCreate.topic)
  async orderCreate(
    @Body() dto: OrderCreate.Request
  ): Promise<OrderCreate.Response> {
    const order = await this.orderRepository.createOrder({ ...dto });
    return {
      order,
    };
  }
}
