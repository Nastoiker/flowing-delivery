import {
  FoodGetAll,
  OrderCreate,
  OrderFindById,
  OrderGetAll,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { OrderRepository } from './order.repository';

@Controller()
export class OrderQueries {
  constructor(private readonly orderRepository: OrderRepository) {}
  @RMQValidate()
  @RMQRoute(OrderFindById.topic)
  async foodByIdInfo(
    @Body() { id }: OrderFindById.Request
  ): Promise<OrderFindById.Response> {
    const order = await this.orderRepository.findOrder(id);
    return {
      order,
    };
  }
  @RMQValidate()
  @RMQRoute(OrderGetAll.topic)
  async getOrders({
    sort,
    filter,
    page,
    pageSize,
  }: FoodGetAll.Request): Promise<OrderGetAll.Response> {
    const { data, allCount } = await this.orderRepository.findAllOrders({
      sort,
      filter,
      page,
      pageSize,
    });
    return {
      orders: data,
      allCount,
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
