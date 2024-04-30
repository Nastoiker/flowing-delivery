import { IsNumber, IsString } from 'class-validator';

export class ShoppingCartDto {
  @IsNumber()
  id: number;
  @IsNumber()
  userId: number;
  @IsNumber()
  productId: number;
  @IsNumber()
  totalPrice: number;
  @IsString()
  purchaseState: string;
  @IsNumber()
  count: number;
}
