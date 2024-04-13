import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        host: configService.get('database.host'),
        dialect: configService.get('database.dialect'),
        logging: configService.get('database.logging'),
        logQueryParameters: configService.get('database.logQueryParameters'),
        dialectOptions: { decimalNumbers: true },
        seederStorage: 'sequelize',
        autoLoadModels: true,
        // Подумать над логикой миграций итд
        // sync: { alter: true },
        // sync: { force: true },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
