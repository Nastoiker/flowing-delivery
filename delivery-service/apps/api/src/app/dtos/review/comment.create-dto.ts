import { IsNumber, IsString } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  title: string;
  @IsNumber()
  productId: number;
  @IsString()
  description: string;
}
