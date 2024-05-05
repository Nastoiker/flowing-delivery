import {
  ReviewRatingCreate,
  ReviewRatingUpdate,
  ReviewsRatingFindByUserId,
  ReviewsRatingsFindByFoodId,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { RatingRepository } from '../rating.repository';

@Controller()
export class RatingQueries {
  constructor(private readonly ratingRepository: RatingRepository) {}

  @RMQValidate()
  @RMQRoute(ReviewRatingCreate.topic)
  async createRating(
    @Body() dto: ReviewRatingCreate.Request
  ): Promise<ReviewRatingCreate.Response> {
    await this.ratingRepository.createRating(dto);
    return {
      message: 'Создана оценка',
    };
  }

  @RMQValidate()
  @RMQRoute(ReviewRatingUpdate.topic)
  async updateRating(
    @Body() { id, ...dto }: ReviewRatingUpdate.Request
  ): Promise<ReviewRatingUpdate.Response> {
    const rating = await this.ratingRepository.updateRating(id, dto);
    return {
      rating,
    };
  }

  @RMQValidate()
  @RMQRoute(ReviewsRatingsFindByFoodId.topic)
  async ratingsByFoodId(
    @Body() { foodId }: ReviewsRatingsFindByFoodId.Request
  ): Promise<ReviewsRatingsFindByFoodId.Response> {
    const ratings = await this.ratingRepository.findRatingByFoodId(foodId);
    return {
      ratings,
    };
  }

  @RMQValidate()
  @RMQRoute(ReviewsRatingFindByUserId.topic)
  async ratingsByUserId(
    @Body() { userId }: ReviewsRatingFindByUserId.Request
  ): Promise<ReviewsRatingFindByUserId.Response> {
    const ratings = await this.ratingRepository.findRatingsByUserId(userId);
    return {
      ratings,
    };
  }
}
