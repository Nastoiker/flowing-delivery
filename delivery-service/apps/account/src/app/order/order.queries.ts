import {
  FoodGetAll,
  OrderCreate,
  OrderFindById,
  OrderGetAll,
  OrderGetPurchsedByUserId,
  OrderUpdate,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { ShoppingCartRepository } from '../shopping-cart/repositories/Shopping-cart.repositories';
import { OrderRepository } from './order.repository';

@Controller()
export class OrderQueries {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly shoppingCarTRep: ShoppingCartRepository
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
  @RMQRoute(OrderGetAll.topic)
  async getMyOrders({
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
  @RMQRoute(OrderGetPurchsedByUserId.topic)
  async getMyPurchasedOrders({
    userId,
  }: OrderGetPurchsedByUserId.Request): Promise<OrderGetPurchsedByUserId.Response> {
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
    await this.orderRepository.updateOrder(dto);
    return {
      message: 'Обновлено',
    };
  }
  @RMQValidate()
  @RMQRoute(OrderCreate.topic)
  async orderCreate(
    @Body() dto: OrderCreate.Request
  ): Promise<OrderCreate.Response> {
    const cartItems = await this.shoppingCarTRep.getShoppingCardByUserId(
      dto.userId
    );
    if (!cartItems.length) {
      throw new Error('Корзина пуста');
    }
    const order = await this.orderRepository.createOrder({ ...dto });
    await this.orderRepository.createFoodForOrder(cartItems, order.id);
    await this.shoppingCarTRep.clearedShoppingCart(dto.userId);
    return {
      order,
    };
  }
}
