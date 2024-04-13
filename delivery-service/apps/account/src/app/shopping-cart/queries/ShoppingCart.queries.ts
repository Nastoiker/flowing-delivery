import {
  ShoppingCardCreate,
  ShoppingCardGetByUserId,
  ShoppingCardRemove,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { ShoppingCartRepository } from '../repositories/Shopping-cart.repositories';

@Controller()
export class ShoppingCardQueries {
  constructor(private readonly cardRepository: ShoppingCartRepository) {}

  @RMQValidate()
  @RMQRoute(ShoppingCardCreate.topic)
  async addCard(
    @Body() cardDetails: ShoppingCardCreate.Request
  ): Promise<ShoppingCardCreate.Response> {
    const shoppingCard = await this.cardRepository.createShoppingCart(
      cardDetails
    );
    return {
      shoppingCard,
    };
  }

  @RMQValidate()
  @RMQRoute(ShoppingCardRemove.topic)
  async removeCard(
    @Body() { id: cardId }: ShoppingCardRemove.Request
  ): Promise<ShoppingCardRemove.Response> {
    await this.cardRepository.deleteShoppingCart(cardId);
    return {
      message: 'succes deleted',
    };
  }

  @RMQValidate()
  @RMQRoute(ShoppingCardGetByUserId.topic)
  async getAllCards(
    @Body() { userId }: ShoppingCardGetByUserId.Request
  ): Promise<ShoppingCardGetByUserId.Response> {
    const shoppingCard = await this.cardRepository.getShoppingCardByUserId(
      userId
    );
    return {
      shoppingCard,
    };
  }
}
