import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RMQModule } from 'nestjs-rmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configs/configuration';
import { getRMQConfig } from './configs/rmq.config';
import { DatabaseModule } from './database/database.module';
import { EventQueries } from './event.queries';
import { Event } from './model/event.model';
import { EventRepository } from './repositories/event.repositories';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: 'envs/.event.env',
      isGlobal: true,
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    SequelizeModule.forFeature([Event]),
  ],
  controllers: [AppController, EventQueries],
  providers: [AppService, EventRepository],
  exports: [EventRepository],
})
export class AppModule {}
