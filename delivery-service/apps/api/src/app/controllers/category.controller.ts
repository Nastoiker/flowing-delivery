import {
  CategoryCreate,
  CategoryFoodsInfo,
  CategoryGetAll,
  CategoryUpdate,
} from '@delivery-service/contracts';
import { MFile } from '@delivery-service/interfaces';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RMQService } from 'nestjs-rmq';
import { CreateCategoryDto } from '../dtos/category/category.dto';
import { FilesService } from '../file.service';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly filesService: FilesService
  ) {}

  @Get()
  async getCategories() {
    try {
      return await this.rmqService.send<
        CategoryGetAll.Request,
        CategoryGetAll.Response
      >(CategoryGetAll.topic, {}, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Put()
  async update(@Body() categoryUpdate: any) {
    try {
      return await this.rmqService.send<
        CategoryUpdate.Request,
        CategoryUpdate.Response
      >(CategoryUpdate.topic, categoryUpdate, {
        headers: { requestId: 'adad' },
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    try {
      return await this.rmqService.send<
        CategoryFoodsInfo.Request,
        CategoryFoodsInfo.Response
      >(
        CategoryFoodsInfo.topic,
        { categoryId: id },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Post('create')
  @UseInterceptors(FileInterceptor('pictures'))
  async createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() category: CreateCategoryDto
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
        })
      );
      return await this.rmqService.send<
        CategoryCreate.Request,
        CategoryCreate.Response
      >(
        CategoryCreate.topic,
        { name: category.name, slug: category.slug, pictures: img.url },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}
