import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RMQModule } from 'nestjs-rmq';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Banner } from './banner.model';
import { BannerQueries } from './banner.queries';
import { BannerRepository } from './banner.repository';
import configuration from './configs/configuration';
import { getRMQConfig } from './configs/rmq.config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: 'envs/.banner.env',
      isGlobal: true,
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    SequelizeModule.forFeature([Banner]),
  ],
  controllers: [AppController, BannerQueries],
  providers: [AppService, BannerRepository],
  exports: [BannerRepository],
})
export class AppModule {}
