import { IsNumber } from 'class-validator';

export class RatingUpdateDto {
  @IsNumber()
  id: number;
  @IsNumber()
  foodId: number;
  @IsNumber()
  rating: number;
}
