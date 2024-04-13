import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { FilesService } from './src/app/file.service';
import configuration from './src/config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  providers: [FilesService],
})
export class AppModule {}
