import { BannerCreate, BannerGetAll } from '@delivery-service/contracts';
import { MFile } from '@delivery-service/interfaces';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RMQService } from 'nestjs-rmq';
import { CreateBannerDto } from '../dtos/banner/banner.dto';
import { FilesService } from '../file.service';

@Controller('banners')
export class BannerController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly filesService: FilesService
  ) {}

  @Get()
  async getBanners() {
    try {
      return await this.rmqService.send<
        BannerGetAll.Request,
        BannerGetAll.Response
      >(BannerGetAll.topic, {}, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Post('create')
  @UseInterceptors(FileInterceptor('picture'))
  async createBanner(
    @UploadedFile() file: Express.Multer.File,
    @Body() banner: CreateBannerDto
  ) {
    try {
      const saveFile: MFile = new MFile(file);
      if (!file.mimetype.includes('image')) {
        throw new BadRequestException('Неверный формат файла');
      }
      const extension = file.originalname.split('.');
      const img = await this.filesService.saveFile(
        new MFile({
          originalname:
            file.originalname.split('.')[0] +
            '.' +
            extension[extension.length - 1],
          buffer: Buffer.from(file.buffer),
        }),
        '/banner'
      );
      return await this.rmqService.send<
        BannerCreate.Request,
        BannerCreate.Response
      >(
        BannerCreate.topic,
        {
          alt: banner.alt,
          priority: banner.priority,
          link: banner.link,
          picture: img.url,
        },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}
