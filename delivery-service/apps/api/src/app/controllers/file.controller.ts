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

@Controller('files')
export class FileController {
  constructor(private readonly rmqService: RMQService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createFile(@UploadedFile() file: Express.Multer.File) {
    const fileData = {
      name: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      path: file.path,
    };
    return await this.rmqService.send('FileCreate', fileData);
  }

  @Get(':id')
  async getFile(@Param('id') id: string) {
    return await this.rmqService.send('FileGet', { id });
  }

  @Put(':id')
  async updateFile(
    @Param('id') id: string,
    @Body() fileData: Partial<FileDto>
  ) {
    return await this.rmqService.send('FileUpdate', { id, ...fileData });
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.rmqService.send('FileDelete', { id });
  }
}
