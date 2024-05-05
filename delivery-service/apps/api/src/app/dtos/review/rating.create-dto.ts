import { IsNumber } from 'class-validator';

export class RatingCreateDto {
  @IsNumber()
  foodId: number;
  @IsNumber()
  rating: number;
}
