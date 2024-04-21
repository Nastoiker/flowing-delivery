import {
  FileCreate,
  FileGetInfo,
  FileUpdate,
} from '@delivery-service/contracts';
import {
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
import { UserId } from '../guards/user.decorator';

@Controller('files')
// @UseGuards(JWTAuthGuard)
export class FileController {
  constructor(private readonly rmqService: RMQService) {}

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
    >(FileGetInfo.topic, { id });
  }

  @Put(':id')
  async updateFile(
    @Param('id') id: string,
    @Body() fileData: Partial<FileDto>
  ) {
    return await this.rmqService.send<FileUpdate.Request, FileUpdate.Response>(
      FileUpdate.topic,
      { id, ...fileData }
    );
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.rmqService.send('FileDelete', { id });
  }
}
