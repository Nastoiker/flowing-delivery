import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RMQModule } from 'nestjs-rmq';
import { DatabaseModule } from '../database/database.module';
import { AppService } from './app.service';
import configuration from './configs/configuration';
import { getRMQConfig } from './configs/rmq.config';
import { Payment } from './payment.model';
import { PaymentQueries } from './payment.queries';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: 'envs/.banner.env',
      isGlobal: true,
    }),
    HttpModule,
    RMQModule.forRootAsync(getRMQConfig()),
    SequelizeModule.forFeature([Payment]),
  ],
  controllers: [PaymentQueries],
  providers: [AppService],
})
export class AppModule {}
