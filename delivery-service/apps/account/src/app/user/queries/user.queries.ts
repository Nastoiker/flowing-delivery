import {
  AccountGetAll,
  AccountUpdate,
  AccountUpdateUser,
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
  @RMQRoute(AccountGetAll.topic)
  async users(_: AccountGetAll.Request): Promise<AccountGetAll.Response> {
    const users = await this.userRepository.getAllUsers();
    return {
      users,
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
  @RMQRoute(AccountUpdate.topic)
  async updateMe(
    @Body() { user }: AccountUpdate.Request
  ): Promise<AccountUpdate.Response> {
    await this.userRepository.updateUser(user);
    return {
      message: 'Данные обновлены',
    };
  }
  @RMQValidate()
  @RMQRoute(AccountUpdateUser.topic)
  async updateUser(
    @Body() { user }: AccountUpdateUser.Request
  ): Promise<AccountUpdateUser.Response> {
    await this.userRepository.updateUser(user);
    return {
      message: 'Данные обновлены',
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
