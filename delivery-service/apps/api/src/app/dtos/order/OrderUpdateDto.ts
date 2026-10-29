import { IsIn, IsInt, IsPositive } from 'class-validator';

export class UpdateOrderDto {
  @IsInt()
  @IsPositive()
  id: number;

  @IsIn(['created', 'confirmed', 'delivery', 'received'])
  status: string;
}
