import { IFile } from '@nestjs/common/pipes/file/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FileUpdate {
  export const topic = 'file.update.command';
  export class Request {
    id: string | undefined;
    name?: string;
    contentType?: string;
    size?: number;
    path?: string;
  }
  export class Response {
    file: IFile | undefined;
  }
}
