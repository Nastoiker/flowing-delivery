import { FileUpload } from '@delivery-service/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { join } from 'path';
import { FilesService } from './file.service';
import { MFile } from './mfile';
@Controller()
export class FilesQueries {
  private readonly baseDir = join(__dirname, '../files');

  constructor(private readonly filesService: FilesService) {}
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
    return join(this.baseDir, `${fileName}.txt`);
  }
  // @RMQValidate()
  // @RMQRoute(FileCreate.topic)
  // async createFile(
  //   @Body() file: FileCreate.Request
  // ): Promise<FileCreate.Response> {
  //   await fs.writeFile(this.getFilePath(fileName), content, 'utf8');
  //   return { message: 'File created successfully' };
  // }

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
