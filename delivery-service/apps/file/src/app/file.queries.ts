import {
  FileCreate,
  FileDelete,
  FileGetInfo,
  FileUpdate,
} from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { promises as fs } from 'fs';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { join } from 'path';
@Controller()
export class FilesController {
  private readonly baseDir = join(__dirname, '../files');

  constructor() {
    fs.mkdir(this.baseDir, { recursive: true }).catch(console.error);
  }

  private getFilePath(fileName: string): string {
    return join(this.baseDir, `${fileName}.txt`);
  }

  @RMQValidate()
  @RMQRoute(FileCreate.topic)
  async createFile(
    @Body() { fileName, content }: FileCreate.Request
  ): Promise<FileCreate.Response> {
    await fs.writeFile(this.getFilePath(fileName), content, 'utf8');
    return { message: 'File created successfully' };
  }

  @RMQValidate()
  @RMQRoute('deleteFile')
  async deleteFile(
    @Body() { fileName }: FileDelete.Request
  ): Promise<FileDelete.Response> {
    await fs.unlink(this.getFilePath(fileName));
    return { message: 'File deleted successfully' };
  }

  @RMQValidate()
  @RMQRoute(FileGetInfo.topic)
  async readFile(
    @Body() { fileName }: FileGetInfo.Request
  ): Promise<FileGetInfo.Response> {
    const content = await fs.readFile(this.getFilePath(fileName), 'utf8');
    return { content };
  }

  @RMQValidate()
  @RMQRoute('updateFile')
  async updateFile(
    @Body() { fileName, content }: FileUpdate.Request
  ): Promise<FileUpdate.Response> {
    await fs.writeFile(this.getFilePath(fileName), content, 'utf8');
    return { message: 'File updated successfully' };
  }
}
