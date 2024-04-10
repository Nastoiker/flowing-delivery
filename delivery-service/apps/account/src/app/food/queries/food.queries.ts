import {
  AccountUserInfo,
  AccountUserOrders,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class FoodQueries {
  constructor(private readonly foodRepository: UserRepository) {}

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
}
