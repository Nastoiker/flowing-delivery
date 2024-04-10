import { FoodFindById } from '@delivery-service/contracts';
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

@Controller('food')
export class FoodController {
  constructor(private readonly rmqService: RMQService) {}

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

  @Cron('*/5 * * * * *')
  async cron() {
    Logger.log('Done');
  }
}
