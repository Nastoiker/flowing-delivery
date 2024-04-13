import { IFile } from '@nestjs/common/pipes/file/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FileCreate {
  export const topic = 'file.create.command';
  export class Request {
    name: string | undefined;
    contentType: string | undefined;
    size: number | undefined;
    path: string | undefined;
  }
  export class Response {
    file: IFile | undefined;
  }
}
