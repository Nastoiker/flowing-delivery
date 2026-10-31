import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MAX_IMAGE_BYTES, mediaStorageProvider } from './storage/media-storage';
import { MediaController } from './storage/media.controller';
import { HealthController } from './controllers/health.controller';

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
import { OrderController } from './controllers/order.controller';
import { PaymentController } from './controllers/payment.controller';
import { ReviewController } from './controllers/review.controller';
import { ShoppingCartController } from './controllers/shopping-cart.controller';
import { UserController } from './controllers/user.controller';
import { FilesService } from './file.service';
import { SocketGateway } from './socket.gateway';
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
    MulterModule.register({ limits: { fileSize: MAX_IMAGE_BYTES, files: 1 } }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  controllers: [
    HealthController,
    MediaController,
    AuthController,
    UserController,
    PaymentController,
    OrderController,
    ShoppingCartController,
    FoodController,
    BannerController,
    ReviewController,
    CategoryController,
    FileController,
  ],
  providers: [JwtStrategy, SocketGateway, FilesService, mediaStorageProvider],
})
export class AppModule {}
