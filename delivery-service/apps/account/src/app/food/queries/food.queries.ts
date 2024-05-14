import {
  FoodCreate,
  FoodDeleteById,
  FoodFindById,
  FoodFindBySearch,
  FoodGetAll,
  FoodUpdate,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { FoodRepository } from '../repositories/food.repositories';

@Controller()
export class FoodQueries {
  constructor(private readonly foodRepository: FoodRepository) {}

  @RMQValidate()
  @RMQRoute(FoodFindById.topic)
  async foodByIdInfo(
    @Body() { id }: FoodFindById.Request
  ): Promise<FoodFindById.Response> {
    const food = await this.foodRepository.findFood(id);
    return {
      food,
    };
  }
  @RMQValidate()
  @RMQRoute(FoodGetAll.topic)
  async foodAll({
    sort,
    filter,
    page,
    pageSize,
  }: FoodGetAll.Request): Promise<FoodGetAll.Response> {
    const { rows, count } = await this.foodRepository.findAllFood({
      sort,
      filter,
      page,
      pageSize,
    });
    return {
      foods: rows,
    };
  }
  @RMQValidate()
  @RMQRoute(FoodFindBySearch.topic)
  async foodFindBySearch({
    search,
  }: FoodFindBySearch.Request): Promise<FoodFindBySearch.Response> {
    const foods = await this.foodRepository.findBySearch(search);
    return {
      foods,
    };
  }
  @RMQValidate()
  @RMQRoute(FoodUpdate.topic)
  async foodUpdate(
    @Body() foodDtos: FoodUpdate.Request
  ): Promise<FoodUpdate.Response> {
    const food = await this.foodRepository.updateFood(foodDtos);
    return {
      food,
    };
  }
  @RMQValidate()
  @RMQRoute(FoodDeleteById.topic)
  async foodDelete(
    @Body() { id }: FoodDeleteById.Request
  ): Promise<FoodDeleteById.Response> {
    await this.foodRepository.deleteFood(id);
    return {
      message: 'Удалено',
    };
  }
  @RMQValidate()
  @RMQRoute(FoodCreate.topic)
  async foodCreate(
    @Body() foodDtos: FoodCreate.Request
  ): Promise<FoodCreate.Response> {
    const food = await this.foodRepository.createFood(foodDtos);
    return {
      food,
    };
  }
}
