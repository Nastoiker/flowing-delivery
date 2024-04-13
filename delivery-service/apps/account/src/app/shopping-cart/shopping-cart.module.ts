import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCart } from './model/shopping-cart.model';
import { ShoppingCardQueries } from './queries/ShoppingCart.queries';
import { ShoppingCartRepository } from './repositories/Shopping-cart.repositories';

@Module({
  imports: [SequelizeModule.forFeature([ShoppingCart])],
  providers: [ShoppingCartRepository],
  exports: [ShoppingCartRepository],
  controllers: [ShoppingCardQueries],
})
export class ShoppingCartModule {}
