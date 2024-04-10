import { IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  slug: string;
  @IsString()
  title: string;
  @IsNumber()
  status: number;
}
