import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FoodModule } from '../food/food.module';
import { ShoppingCart } from './model/shopping-cart.model';
import { ShoppingCardQueries } from './queries/ShoppingCart.queries';
import { ShoppingCartRepository } from './repositories/Shopping-cart.repositories';

@Module({
  imports: [SequelizeModule.forFeature([ShoppingCart]), FoodModule],
  providers: [ShoppingCartRepository],
  exports: [ShoppingCartRepository, SequelizeModule.forFeature([ShoppingCart])],
  controllers: [ShoppingCardQueries],
})
export class ShoppingCartModule {}
