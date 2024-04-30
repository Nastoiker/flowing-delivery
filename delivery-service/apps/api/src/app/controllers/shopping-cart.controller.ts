import {
  AccountShoppingCart,
  ShoppingCardCreate,
  ShoppingCardRemove,
  ShoppingCardUpdate,
} from '@delivery-service/contracts';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RMQService } from 'nestjs-rmq';
import { ShoppingCartDto } from '../dtos/shopping-cart/ShoppingCart.dto';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly rmqService: RMQService) {}

  @UseGuards(JWTAuthGuard)
  @Get('/my')
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
  @UseGuards(JWTAuthGuard)
  @Post()
  async createShoppingCart(
    @UserId() userId: number,
    @Body() shoppingCart: ShoppingCartDto
  ) {
    try {
      return await this.rmqService.send<
        ShoppingCardCreate.Request,
        ShoppingCardCreate.Response
      >(
        ShoppingCardCreate.topic,
        { userId, ...shoppingCart },
        {
          headers: { requestId: 'adad' },
        }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async deleteShoppingCart(@Param('id') id: number) {
    try {
      return await this.rmqService.send<
        ShoppingCardRemove.Request,
        ShoppingCardRemove.Response
      >(
        ShoppingCardRemove.topic,
        { id: Number(id) },
        {
          headers: { requestId: 'adad' },
        }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Put()
  async updateShoppingCart(
    @UserId() userId: number,
    @Body() shoppingCart: ShoppingCartDto
  ) {
    try {
      return await this.rmqService.send<
        ShoppingCardUpdate.Request,
        ShoppingCardUpdate.Response
      >(
        ShoppingCardUpdate.topic,
        { shoppingCart },
        {
          headers: { requestId: 'adad' },
        }
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
