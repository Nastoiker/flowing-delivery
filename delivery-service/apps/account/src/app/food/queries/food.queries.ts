import {
  FoodCreate,
  FoodFindById,
  FoodFindBySearch,
  FoodGetAll,
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
  async foodAll(_: FoodGetAll.Request): Promise<FoodGetAll.Response> {
    const foods = await this.foodRepository.findAllFood();
    return {
      foods,
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
