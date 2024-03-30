import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from './auth/auth.module';
import configuration from './configs/configuration';
import { getRMQConfig } from './configs/rmq.config';
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
  ],
})
export class AppModule {}
