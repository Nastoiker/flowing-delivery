import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        username: configService.get('database.username', 'CityAstrakhan-user'),
        password: configService.get('database.password', '12345'),
        database: configService.get('database.database', 'CityAstrakhan'),
        host: configService.get('database.host', 'localhost'),
        dialect: configService.get('database.dialect', 'postgres'),
        logging: configService.get('database.logging'),
        port: configService.get('database.port'),
        logQueryParameters: configService.get('database.logQueryParameters'),
        synchronize: true,
        dialectOptions: {
          decimalNumbers: true,
        },
        seederStorage: 'sequelize',
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
