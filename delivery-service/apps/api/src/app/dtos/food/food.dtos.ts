import { IsString } from 'class-validator';

export class FoodDto {
  //@IsNumber()
  categoryId: string;
  @IsString()
  title: string;
  //@IsNumber()
  price: string;
  // @IsNumber()
  count: string;
  //@IsNumber()
  in_stock: string;
  // @IsNumber()
  calories: string;
  // @IsNumber()
  grams: string;
  // @IsString()
  description: string;
}
