import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Food } from '../food/models/food.model';
import { Rating } from './rating.model';

@Injectable()
export class RatingRepository {
  constructor(
    @InjectModel(Rating) private readonly ratingModel: typeof Rating
  ) {}

  async createRating(rating: any) {
    const ratingCreated = await this.ratingModel.create({
      ...rating,
    });
    if (!ratingCreated) {
      throw new Error('Ошибка создания оценки');
    }
    return ratingCreated;
  }

  async findRatingsByUserId(userId: number) {
    return this.ratingModel.findAll({
      where: { userId },
      include: [{ model: Food }],
    });
  }

  async findRatingByFoodId(foodId: number) {
    return this.ratingModel.findAll({ where: { foodId } });
  }

  async updateRating(ratingId: number, ratingDto) {
    const rating = await this.ratingModel.findByPk(ratingId);
    if (!rating) {
      throw new Error('Ошибка, оценка не найдена');
    }
    return rating.update(ratingDto);
  }

  async removeRating(ratingId: number) {
    const rating = await this.ratingModel.findByPk(ratingId);
    if (!rating) {
      throw new Error('Ошибка, оценка не найдена');
    }
    return rating.destroy();
  }
}
