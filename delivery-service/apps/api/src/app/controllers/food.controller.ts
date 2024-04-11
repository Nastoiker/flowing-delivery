import {
  FoodCreate,
  FoodFindById,
  FoodGetAll,
} from '@delivery-service/contracts';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RMQService } from 'nestjs-rmq';
import { FoodDto } from '../dtos/food/food.dtos';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('food')
export class FoodController {
  constructor(private readonly rmqService: RMQService) {}
  @Get()
  async getFoods() {
    try {
      return await this.rmqService.send<
        FoodGetAll.Request,
        FoodGetAll.Response
      >(FoodGetAll.topic, {}, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Post('info')
  async info(@UserId() id: number) {
    try {
      return await this.rmqService.send<
        FoodFindById.Request,
        FoodFindById.Response
      >(FoodFindById.topic, { id }, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Post('create')
  async create(@Body() foodDto: FoodDto) {
    try {
      return await this.rmqService.send<
        FoodCreate.Request,
        FoodCreate.Response
      >(FoodCreate.topic, foodDto, { headers: { requestId: 'adad' } });
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
