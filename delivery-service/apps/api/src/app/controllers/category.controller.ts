import { CategoryCreate, CategoryGetAll } from '@delivery-service/contracts';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RMQService } from 'nestjs-rmq';
import { CreateCategoryDto } from '../dtos/category/category.dto';

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
  @Post('create')
  async createCategory(@Body() category: CreateCategoryDto) {
    try {
      return await this.rmqService.send<
        CategoryCreate.Request,
        CategoryCreate.Response
      >(CategoryCreate.topic, { category }, { headers: { requestId: 'adad' } });
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
