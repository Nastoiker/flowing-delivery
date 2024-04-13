import { IsNumber, IsString } from 'class-validator';

export class FileDto {
  @IsNumber()
  id: string;
  @IsString()
  name: string;
  @IsString()
  contentType: string;
  @IsNumber()
  size: number;
  @IsString()
  path: string;
}
