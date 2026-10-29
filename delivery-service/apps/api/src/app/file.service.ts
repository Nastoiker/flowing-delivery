import { FileElementResponse, MFile } from '@delivery-service/interfaces';
import {
  BadRequestException,
  Inject,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MEDIA_STORAGE,
  MediaStorage,
} from './storage/media-storage';

@Injectable()
export class FilesService {
  constructor(@Inject(MEDIA_STORAGE) private readonly storage: MediaStorage) {}

  async saveFile(file: MFile): Promise<FileElementResponse> {
    if (!file?.buffer?.length)
      throw new BadRequestException('Image is required');
    if (file.buffer.length > MAX_IMAGE_BYTES)
      throw new PayloadTooLargeException();
    let extension: string;
    try {
      const metadata = await sharp(file.buffer, {
        limitInputPixels: 40_000_000,
      }).metadata();
      extension = metadata.format === 'jpeg' ? 'jpg' : metadata.format;
      if (!IMAGE_TYPES[extension]) throw new Error('Unsupported format');
    } catch {
      throw new BadRequestException('Supported images: PNG, JPEG, WebP, GIF');
    }
    const key = `${new Date()
      .toISOString()
      .slice(0, 10)}/${randomUUID()}.${extension}`;
    const url = await this.storage.put(
      key,
      file.buffer,
      IMAGE_TYPES[extension]
    );
    return { url, name: file.originalname };
  }
}
