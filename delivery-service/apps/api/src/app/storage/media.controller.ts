import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { MEDIA_STORAGE, MediaStorage } from './media-storage';

@Controller('media/s3')
export class MediaController {
  constructor(@Inject(MEDIA_STORAGE) private readonly storage: MediaStorage) {}

  @Get(':date/:name')
  @Header('X-Content-Type-Options', 'nosniff')
  async read(
    @Param('date') date: string,
    @Param('name') name: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const object = await this.storage.openS3(`${date}/${name}`);
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return new StreamableFile(object.stream, {
      type: object.type,
      length: object.length,
    });
  }
}
