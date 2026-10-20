import { FileElementResponse, MFile } from '@delivery-service/interfaces';
import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { mkdir, writeFile } from 'node:fs/promises';

@Injectable()
export class FilesService {
  async saveFile(file: MFile, folder?: string): Promise<FileElementResponse> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    // Built-in fs avoids relying on a transitive dev dependency in the runtime image.
    await mkdir(uploadFolder, { recursive: true });
    await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
    return {
      url: `/uploads/${dateFolder}/${file.originalname}`,
      name: file.originalname,
    };
  }
}
