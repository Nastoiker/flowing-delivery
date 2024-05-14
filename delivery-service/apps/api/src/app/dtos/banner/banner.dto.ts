import { IsNumber, IsString } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  alt: string;
  @IsString()
  link: string;
  @IsNumber()
  priority: number;
}
