import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCart } from './model/shopping-cart.model';
import { ShoppingCartRepository } from './repositories/Shopping-cart.repositories';

@Module({
  imports: [SequelizeModule.forFeature([ShoppingCart])],
  providers: [ShoppingCartRepository],
  exports: [ShoppingCartRepository],
})
export class ShoppingCartModule {}
