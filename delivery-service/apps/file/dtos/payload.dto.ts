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
