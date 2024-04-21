import { FileCreate } from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { path } from 'app-root-path';
import { writeFile } from 'fs/promises';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { FilesService } from './file.service';
@Controller()
export class FilesQueries {
  private readonly baseDir = path + '/uploads/';

  constructor(private readonly filesService: FilesService) {}
  @RMQValidate()
  @RMQRoute(FileCreate.topic)
  async createFile(
    @Body() { file }: FileCreate.Request
  ): Promise<FileCreate.Response> {
    const extension = file.originalname.split('.');

    await writeFile(
      // `${this.baseDir + new Date().getTime()}.${
      //   extension[extension.length - 1]
      // }`,
      `${this.baseDir + new Date().getTime()}.jpg`,
      file.buffer.buffer
    );
    return { message: file };
  }
  @RMQValidate()
  @RMQRoute(FileUpload.topic)
  async uploadFile(
    @Body() { file }: FileUpload.Request
  ): Promise<FileUpload.Response> {
    if (file.mimetype.includes('image')) {
      const saveArray: MFile[] = [new MFile(file)];

      const buffer = await this.filesService.convertToWebP(file.buffer);
      saveArray.push(
        new MFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer,
        })
      );
    }
    return { message: 'File created successfully' };
  }
  private getFilePath(fileName: string): string {
    return join(this.baseDir, `${fileName}.`);
  }

  // @RMQValidate()
  // @RMQRoute(FileDelete.topic)
  // async deleteFile(
  //   @Body() { fileName }: FileDelete.Request
  // ): Promise<FileDelete.Response> {
  //   await fs.unlink(this.getFilePath(fileName));
  //   return { message: 'File deleted successfully' };
  // }

  // @RMQValidate()
  // @RMQRoute(FileGetInfo.topic)
  // async readFile(
  //   @Body() { fileName }: FileGetInfo.Request
  // ): Promise<FileGetInfo.Response> {
  //   const content = await fs.readFile(this.getFilePath(fileName), 'utf8');
  //   return { content };
  // }

  // @RMQValidate()
  // @RMQRoute(FileUpdate.topic)
  // async updateFile(
  //   @Body() file: FileUpdate.Request
  // ): Promise<FileUpdate.Response> {
  //   if (file.mimetype.includes('image')) {
  //     const buffer = await this.filesService.convertToWebP(file.buffer);
  //     saveArray.push(
  //       new MFile({
  //         originalname: `${file.originalname.split('.')[0]}.webp`,
  //         buffer,
  //       })
  //     );
  //   }
  //   return this.filesService.saveFiles(saveArray);
  // }
}
