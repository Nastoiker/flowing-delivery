import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCart } from './model/shopping-cart.model';

@Module({
  imports: [SequelizeModule.forFeature([ShoppingCart])],
  providers: [],
  exports: [],
})
export class ShoppingCartModule {}
