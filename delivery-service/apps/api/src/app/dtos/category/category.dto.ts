import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  slug: string;
  @IsString()
  name: string;
}
