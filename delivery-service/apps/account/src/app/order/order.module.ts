import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FoodModule } from '../food/food.module';
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module';
import { OrderFood } from './order-food.model';
import { Order } from './order.model';
import { OrderQueries } from './order.queries';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderFood]),
    ShoppingCartModule,
    FoodModule,
  ],
  providers: [OrderRepository],
  exports: [OrderRepository],
  controllers: [OrderQueries],
})
export class OrderModule {}
