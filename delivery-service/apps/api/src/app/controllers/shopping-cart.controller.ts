import { AccountShoppingCart } from '@delivery-service/contracts';
import {
  Controller,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly rmqService: RMQService) {}

  @UseGuards(JWTAuthGuard)
  @Post('info')
  async info(@UserId() userId: number) {
    try {
      return await this.rmqService.send<
        AccountShoppingCart.Request,
        AccountShoppingCart.Response
      >(
        AccountShoppingCart.topic,
        { userId },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Cron('*/5 * * * * *')
  async cron() {
    Logger.log('Done');
  }
}
