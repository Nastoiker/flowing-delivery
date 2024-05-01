import {
  CategoryCreate,
  CategoryFoodsInfo,
  CategoryGetAll,
} from '@delivery-service/contracts';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
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
  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    try {
      return await this.rmqService.send<
        CategoryFoodsInfo.Request,
        CategoryFoodsInfo.Response
      >(
        CategoryFoodsInfo.topic,
        { categoryId: id },
        { headers: { requestId: 'adad' } }
      );
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
}
