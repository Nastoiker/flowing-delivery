import { CardAdd, CardGetAll, CardRemove } from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { ShoppingCartRepository } from '../repositories/Shopping-cart.repositories';

@Controller()
export class ShoppingCardQueries {
  constructor(private readonly cardRepository: ShoppingCartRepository) {}

  @RMQValidate()
  @RMQRoute(CardAdd.topic)
  async addCard(
    @Body() cardDetails: CardAdd.Request
  ): Promise<CardAdd.Response> {
    const success = await this.cardRepository.createShoppingCart(cardDetails);
    return {
      success,
    };
  }

  @RMQValidate()
  @RMQRoute(CardRemove.topic)
  async removeCard(
    @Body() { cardId }: CardRemove.Request
  ): Promise<CardRemove.Response> {
    const success = await this.cardRepository.deleteShoppingCart(cardId);
    return {
      success,
    };
  }

  @RMQValidate()
  @RMQRoute(CardGetAll.topic)
  async getAllCards(): Promise<CardGetAll.Response> {
    const cards = await this.cardRepository.findShoppingCart();
    return {
      cards,
    };
  }
}
