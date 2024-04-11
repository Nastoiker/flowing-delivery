import { FoodCreate, FoodFindById } from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { FoodRepository } from '../repositories/food.repositories';

@Controller()
export class FoodQueries {
  constructor(private readonly foodRepository: FoodRepository) {}

  @RMQValidate()
  @RMQRoute(FoodFindById.topic)
  async foodInfo(
    @Body() { id }: FoodFindById.Request
  ): Promise<FoodFindById.Response> {
    const food = await this.foodRepository.findFood(id);
    return {
      food,
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
