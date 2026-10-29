import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FoodModule } from '../food/food.module';
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module';
import { OrderFood } from './order-food.model';
import { Order } from './order.model';
import { OrderQueries } from './order.queries';
import { OrderRepository } from './order.repository';
import { PlaceOrderService } from './place-order.service';
import { CHECKOUT_UNIT_OF_WORK } from './application/checkout.ports';
import { SequelizeCheckout } from './infrastructure/sequelize-checkout';
import { SequelizeOrderStatus } from './infrastructure/sequelize-order-status';
import { ChangeOrderStatus } from './application/change-order-status';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderFood]),
    ShoppingCartModule,
    FoodModule,
  ],
  providers: [
    OrderRepository,
    PlaceOrderService,
    SequelizeCheckout,
    SequelizeOrderStatus,
    {
      provide: ChangeOrderStatus,
      useFactory: (store: SequelizeOrderStatus) => new ChangeOrderStatus(store),
      inject: [SequelizeOrderStatus],
    },
    { provide: CHECKOUT_UNIT_OF_WORK, useExisting: SequelizeCheckout },
  ],
  exports: [OrderRepository],
  controllers: [OrderQueries],
})
export class OrderModule {}
