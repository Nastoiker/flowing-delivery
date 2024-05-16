import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Purchase } from './purchase.model';

@Module({
  imports: [SequelizeModule.forFeature([Purchase])],
  providers: [],
  exports: [],
  controllers: [],
})
export class PurchaseModel {}
