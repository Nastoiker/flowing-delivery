import { CategoryGetAll } from '@delivery-service/contracts';
import { Controller, Get, Logger, UnauthorizedException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RMQService } from 'nestjs-rmq';

@Controller('categories')
export class CategoryController {
  constructor(private readonly rmqService: RMQService) {}

  @Get()
  async getCategories() {
    try {
      return await this.rmqService.send<
        CategoryGetAll.Request,
        CategoryGetAll.Response
      >(CategoryGetAll.topic, {}, { headers: { requestId: 'adad' } });
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
