import { IsNumber, IsString } from 'class-validator';

export class FoodDto {
  @IsNumber()
  categoryId: number;
  @IsString()
  title: string;
  @IsNumber()
  price: number;
  @IsNumber()
  count: number;
  @IsNumber()
  in_stock: number;
  @IsNumber()
  calories: number;
  @IsNumber()
  grams: number;
  @IsString()
  description: string;
  @IsString()
  pictures: string;
}
