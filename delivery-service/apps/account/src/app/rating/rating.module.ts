import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingQueries } from './queries/rating.queries';
import { Rating } from './rating.model';
import { RatingRepository } from './rating.repository';

@Module({
  imports: [SequelizeModule.forFeature([Rating])],
  providers: [RatingRepository],
  exports: [RatingRepository],
  controllers: [RatingQueries],
})
export class RatingModule {}
