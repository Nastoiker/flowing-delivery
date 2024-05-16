import { IsNumber, IsString } from 'class-validator';

export class FileDto {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsString()
  contentType: string;
  @IsNumber()
  size: number;
  @IsString()
  path: string;
}
export class PayloadDto {
  width: number;
  height: number;
  quality: number;
  type: ImageType;
}
export enum ImageType {
  Png = 'png',
  Jpg = 'jpg',
  Webp = 'webp',
  Unknown = 'unknown',
}
