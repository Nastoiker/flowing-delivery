import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './model/category.model';
import { CategoryQueries } from './queries/category.queries';
import { CategoryRepository } from './repositories/category.repositories';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  providers: [CategoryRepository],
  controllers: [CategoryQueries],
  exports: [CategoryRepository],
})
export class CategoryModule {}
