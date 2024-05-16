import {
  FileCreate,
  FileGetInfo,
  FileUpdate,
} from '@delivery-service/contracts';
import { FileElementResponse, MFile } from '@delivery-service/interfaces';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RMQService } from 'nestjs-rmq';
import { FileDto } from '../dtos/file/file.dto';
import { FilesService } from '../file.service';
import { UserId } from '../guards/user.decorator';

@Controller('files')
// @UseGuards(JWTAuthGuard)
export class FileController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly filesService: FilesService
  ) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
    // @Query() params: PayloadDto
  ): Promise<FileElementResponse> {
    const saveFile: MFile = new MFile(file);
    if (!file.mimetype.includes('image')) {
      throw new BadRequestException('Неверный формат файла');
    }
    // console.log({
    //   width: Number(params.width),
    //   height: Number(params.height),
    //   quality: Number(params.quality),
    //   format: params.type,
    // });
    // const res = await this.rmqService.send<
    //   GenerateImages.Request,
    //   GenerateImages.Response
    // >(GenerateImages.Topic, {
    //   image: saveFile.buffer.toString('base64'),
    //   requirements: [
    //     {
    //       width: Number(params.width),
    //       height: Number(params.height),
    //       quality: Number(params.quality),
    //       format: params.type,
    //     },
    //   ],
    // });
    const extension = file.originalname.split('.');

    return this.filesService.saveFile(
      new MFile({
        originalname:
          file.originalname.split('.')[0] +
          '.' +
          extension[extension.length - 1],
        buffer: Buffer.from(file.buffer),
      })
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createFile(
    @UserId() userId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    const fileData = {
      name: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      path: file.path,
      creatorId: userId,
    };
    return await this.rmqService.send<FileCreate.Request, FileCreate.Response>(
      FileCreate.topic,
      { file }
    );
  }

  @Get(':id')
  async getFile(@Param('id') id: string) {
    return await this.rmqService.send<
      FileGetInfo.Request,
      FileGetInfo.Response
    >(FileGetInfo.topic, { id: +id });
  }

  @Put(':id')
  async updateFile(
    @Param('id') id: number,
    @Body() fileData: Partial<FileDto>
  ) {
    return await this.rmqService.send<FileUpdate.Request, FileUpdate.Response>(
      FileUpdate.topic,
      { id: Number(id), ...fileData }
    );
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.rmqService.send('FileDelete', { id });
  }
}
