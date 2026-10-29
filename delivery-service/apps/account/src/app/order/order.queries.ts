import {
  FoodGetAll,
  OrderCreate,
  OrderFindById,
  OrderGetAll,
  OrderGetPendingByUserId,
  OrderGetPurchsedByUserId,
  OrderUpdate,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { OrderRepository } from './order.repository';
import { PlaceOrderService } from './place-order.service';

@Controller()
export class OrderQueries {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly placeOrder: PlaceOrderService
  ) {}
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
  @RMQRoute(OrderGetPendingByUserId.topic)
  async getMyOrders(
    @Body() { userId }: OrderGetPendingByUserId.Request
  ): Promise<OrderGetAll.Response> {
    const { orders } = await this.orderRepository.findMyPendingOrders({
      userId,
      sort: {},
    });
    return {
      orders,
      allCount: orders.length,
    };
  }
  @RMQValidate()
  @RMQRoute(OrderGetPurchsedByUserId.topic)
  async getMyPurchasedOrders(
    @Body() { userId }: OrderGetPurchsedByUserId.Request
  ): Promise<OrderGetPurchsedByUserId.Response> {
    // TODO SORT
    const sort = {};
    const { orders, allCount } =
      await this.orderRepository.findMyPurchasedOrders({
        userId,
        sort,
      });
    return {
      orders,
      allCount,
    };
  }
  @RMQValidate()
  @RMQRoute(OrderUpdate.topic)
  async updateOrder(
    @Body() dto: OrderUpdate.Request
  ): Promise<OrderUpdate.Response> {
    const updatedOrder = await this.orderRepository.updateOrder(dto);
    return {
      message: 'Обновлено',
      userId: updatedOrder.userId,
    };
  }
  @RMQValidate()
  @RMQRoute(OrderCreate.topic)
  async orderCreate(
    @Body() dto: OrderCreate.Request
  ): Promise<OrderCreate.Response> {
    // Транспорт принимает команду; границей транзакции владеет прикладной сценарий.
    return this.placeOrder.execute(dto);
  }
}
