import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from './models/food.model';
import { FoodRepository } from './repositories/food.repositories';

@Module({
  imports: [SequelizeModule.forFeature([Food])],
  providers: [FoodRepository],
  exports: [FoodRepository],
})
export class FoodModule {}
