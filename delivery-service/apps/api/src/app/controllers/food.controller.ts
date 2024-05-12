import {
  FoodCreate,
  FoodFindById,
  FoodFindBySearch,
  FoodGetAll,
  FoodUpdate,
} from '@delivery-service/contracts';
import { MFile } from '@delivery-service/interfaces';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Cron } from '@nestjs/schedule';
import { RMQService } from 'nestjs-rmq';
import { FoodDto } from '../dtos/food/food.dtos';
import { FilesService } from '../file.service';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('food')
export class FoodController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly filesService: FilesService
  ) {}
  @Get()
  async getFoods(@Query() query) {
    try {
      const {
        sort: { field = 'createdAt', direction = 'desc' },
        filter,
        page = 1,
        pageSize = 20,
      } = query;
      return await this.rmqService.send<
        FoodGetAll.Request,
        FoodGetAll.Response
      >(
        FoodGetAll.topic,
        { sort: { field, direction }, filter, page, pageSize },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Get(':id')
  async getFoodById(@Param('id') id: number) {
    try {
      return await this.rmqService.send<
        FoodFindById.Request,
        FoodFindById.Response
      >(FoodFindById.topic, { id }, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Get('/search/:search')
  async findBySearchValue(@Param('search') search: string) {
    try {
      return await this.rmqService.send<
        FoodFindBySearch.Request,
        FoodFindBySearch.Response
      >(FoodFindBySearch.topic, { search }, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Post('info')
  async info(@UserId() id: number) {
    try {
      return await this.rmqService.send<
        FoodFindById.Request,
        FoodFindById.Response
      >(FoodFindById.topic, { id }, { headers: { requestId: 'adad' } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @UseGuards(JWTAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('pictures'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Body() foodDto: FoodDto
  ) {
    try {
      let img;
      if (file) {
        const saveFile: MFile = new MFile(file);
        if (!file.mimetype.includes('image')) {
          throw new BadRequestException('Неверный формат файла');
        }
        const extension = file.originalname.split('.');
        img = await this.filesService.saveFile(
          new MFile({
            originalname:
              file.originalname.split('.')[0] +
              '.' +
              extension[extension.length - 1],
            buffer: Buffer.from(file.buffer),
          })
        );
      }

      return await this.rmqService.send<
        FoodUpdate.Request,
        FoodUpdate.Response
      >(
        FoodUpdate.topic,
        {
          id: Number(id),
          pictures: file && img.url,
          categoryId: parseInt(foodDto.categoryId),
          count: parseInt(foodDto.count),
          description: foodDto.description,
          calories: parseInt(foodDto.calories),
          grams: parseInt(foodDto.grams),
          in_stock: parseInt(foodDto.in_stock),
          title: foodDto.title,
          price: parseInt(foodDto.price),
        },
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
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() foodDto: FoodDto
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
        FoodCreate.Request,
        FoodCreate.Response
      >(
        FoodCreate.topic,
        {
          pictures: img.url,
          categoryId: parseInt(foodDto.categoryId),
          count: parseInt(foodDto.count),
          description: foodDto.description,
          calories: parseInt(foodDto.calories),
          grams: parseInt(foodDto.grams),
          in_stock: parseInt(foodDto.in_stock),
          title: foodDto.title,
          price: parseInt(foodDto.price),
        },
        { headers: { requestId: 'adad' } }
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
  @Cron('*/5 * * * * *')
  async cron() {
    Logger.log('Done');
  }
}
