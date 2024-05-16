import { IsNumber } from 'class-validator';
import { CreateOrderDto } from './OrderCreateDto';

export class UpdateOrderDto extends CreateOrderDto {
  @IsNumber()
  id: number;
}
