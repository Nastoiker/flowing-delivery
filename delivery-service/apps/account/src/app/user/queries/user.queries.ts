import {
  AccountUserInfo,
  AccountUserMe,
  AccountUserOrders,
} from '@delivery-service/contracts';
import { Body, Controller, Query } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repositories';

@Controller()
export class UserQueries {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userInfo(
    @Body() { id }: AccountUserInfo.Request
  ): Promise<AccountUserInfo.Response> {
    const user = await this.userRepository.findUserById(id);
    const profile = new UserEntity(user).getPublicProfile();
    return {
      profile,
    };
  }

  @RMQValidate()
  @RMQRoute(AccountUserOrders.topic)
  async userShoppingCart(
    @Body() { id }: AccountUserOrders.Request
  ): Promise<AccountUserOrders.Response> {
    const user = await this.userRepository.findUserById(id);
    return {
      purchased: user.shoppingCart,
    };
  }
  @RMQValidate()
  @RMQRoute(AccountUserMe.topic)
  async me(
    @Query() { id }: AccountUserMe.Request
  ): Promise<AccountUserMe.Response> {
    const user = await this.userRepository.me(id);
    return {
      profile: user,
    };
  }
}
