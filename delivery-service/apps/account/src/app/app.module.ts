import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import configuration from './configs/configuration';
import { getRMQConfig } from './configs/rmq.config';
import { FoodModule } from './food/food.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: 'envs/.account.env',
      isGlobal: true,
    }),
    UserModule,
    RMQModule.forRootAsync(getRMQConfig()),
    FoodModule,
    CategoryModule,
    ShoppingCartModule,
  ],
})
export class AppModule {}
