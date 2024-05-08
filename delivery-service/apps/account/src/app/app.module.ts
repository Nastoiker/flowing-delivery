import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comments/comment.module';
import configuration from './configs/configuration';
import { getRMQConfig } from './configs/rmq.config';
import { FoodModule } from './food/food.module';
import { RatingModule } from './rating/rating.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: 'envs/.account.env',
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    RMQModule.forRootAsync(getRMQConfig()),
    FoodModule,
    CommentModule,
    RatingModule,
    CategoryModule,
    ShoppingCartModule,
  ],
})
export class AppModule {}
