import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from './models/food.model';
import { FoodQueries } from './queries/food.queries';
import { FoodRepository } from './repositories/food.repositories';

@Module({
  imports: [SequelizeModule.forFeature([Food])],
  providers: [FoodRepository],
  exports: [FoodRepository, SequelizeModule.forFeature([Food])],
  controllers: [FoodQueries],
})
export class FoodModule {}
