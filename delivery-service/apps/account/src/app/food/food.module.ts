import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from './models/food.model';

@Module({
  imports: [SequelizeModule.forFeature([Food])],
  providers: [],
  exports: [],
})
export class FoodModule {}
