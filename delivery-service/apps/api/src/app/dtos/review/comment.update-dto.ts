import { IsNumber, IsString } from 'class-validator';

export class CommentUpdateDto {
  @IsNumber()
  id: number;
  @IsString()
  title: string;
  @IsNumber()
  productId: number;
  @IsString()
  description: string;
}
