import { AccountLogin, AccountRegister } from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    @Body() { email, password, displayName }: AccountRegister.Request
  ): Promise<AccountRegister.Response> {
    return this.authService.register({ email, password, displayName });
  }
}
