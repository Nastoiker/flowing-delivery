import { IsNumber, IsString } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  title: string;
  @IsNumber()
  foodId: number;
  @IsString()
  description: string;
}
