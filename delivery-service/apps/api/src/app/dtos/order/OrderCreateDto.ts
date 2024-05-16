import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  status: string;
  @IsNumber()
  deliveryPrice: number;
  @IsNumber()
  priceFood: number;
  @IsNumber()
  totalPrice: number;
  @IsNumber()
  userId: number;
}
