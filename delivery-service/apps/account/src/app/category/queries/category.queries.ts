import {
  CategoryCreate,
  CategoryFoodsInfo,
  CategoryGetAll,
} from '@delivery-service/contracts';
import { Body, Controller, Query } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { CategoryRepository } from '../repositories/category.repositories';

@Controller()
export class CategoryQueries {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  @RMQValidate()
  @RMQRoute(CategoryGetAll.topic)
  async categoryInfo(@Query() query: any): Promise<CategoryGetAll.Response> {
    const category = await this.categoryRepository.findAllCategory();
    return {
      categories: category,
    };
  }
  @RMQValidate()
  @RMQRoute(CategoryCreate.topic)
  async categoryCreate(
    @Body() { category: categoryDto }: CategoryCreate.Request
  ): Promise<CategoryCreate.Response> {
    const category = await this.categoryRepository.createCategory(categoryDto);
    return {
      category,
    };
  }
  @RMQValidate()
  @RMQRoute(CategoryFoodsInfo.topic)
  async getCategoryById(
    @Body() { categoryId }: CategoryFoodsInfo.Request
  ): Promise<CategoryFoodsInfo.Response> {
    const category = await this.categoryRepository.findCategoryById(categoryId);
    return {
      category: category,
      foods: category.products,
    };
  }
  // @RMQValidate()
  // @RMQRoute(CategoryGetAll.topic)
  // async categoryFoods(@Query() query: CategoryFoodsInfo.Request): Promise<CategoryFoodsInfo.Response> {
  //   // const { category, foods } = await this.categoryRepository.findAllCategory();
  //   return {
  //     // category,
  //     // foods,
  //   };
  // }
  //   @RMQValidate()
  //   @RMQRoute(CategoryGetAll.topic)
  //   async categoryCreate(
  //     @Body() categoryDto: CategoryGetAll.Request
  //   ): Promise<CategoryGetAll.Response> {
  //     const category = await this.categoryRepository.createCategory(categoryDto);
  //     return {
  //       category,
  //     };
  //   }
}
