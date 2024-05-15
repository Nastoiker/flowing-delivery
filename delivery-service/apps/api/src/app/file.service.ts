import { FileElementResponse, MFile } from '@delivery-service/interfaces';
import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FilesService {
  async saveFile(file: MFile, folder?: string): Promise<FileElementResponse> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);
    await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
    return {
      url: `/uploads/${dateFolder}/${file.originalname}`,
      name: file.originalname,
    };
  }
}
