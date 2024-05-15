import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { RMQModule } from 'nestjs-rmq';
import configuration from './configs/configuration';
import { getJWTConfig } from './configs/jwt.config';
import { getRMQConfig } from './configs/rmg.config';
import { AuthController } from './controllers/auth.controller';
import { BannerController } from './controllers/banner.controller';
import { CategoryController } from './controllers/category.controller';
import { FileController } from './controllers/file.controller';
import { FoodController } from './controllers/food.controller';
import { ReviewController } from './controllers/review.controller';
import { ShoppingCartController } from './controllers/shopping-cart.controller';
import { UserController } from './controllers/user.controller';
import { FilesService } from './file.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: 'envs/.api.env',
      isGlobal: true,
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    ShoppingCartController,
    FoodController,
    BannerController,
    ReviewController,
    CategoryController,
    FileController,
  ],
  providers: [JwtStrategy, FilesService],
})
export class AppModule {}
