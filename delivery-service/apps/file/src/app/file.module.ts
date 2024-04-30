import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { RMQModule } from 'nestjs-rmq';
import { getJwtConfig } from './configs/jwt.config';
import { getRMQConfig } from './configs/rmq.config';
import { FilesQueries } from './file.queries';
import { FilesService } from './file.service';

@Module({
  imports: [
    RMQModule.forRootAsync(getRMQConfig()),
    ConfigModule.forRoot({ envFilePath: 'envs/.file.env', isGlobal: true }),
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [FilesQueries],
  providers: [FilesService],
})
export class FilesModule {}
