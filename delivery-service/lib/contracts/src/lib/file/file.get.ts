import { IFile } from '@nestjs/common/pipes/file/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FileGetInfo {
  export const topic = 'file.get-info.command';
  export class Request {
    id: string | undefined;
  }
  export class Response {
    file: IFile | undefined;
  }
}
