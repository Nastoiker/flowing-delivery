import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';

@Module({
  providers: [ShoppingCartService],
  controllers: [ShoppingCartController]
})
export class ShoppingCartModule {}
