// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FileCreate {
  export const topic = 'file.create.command';
  export class Request {
    file: any;
    // id?: number;
    // nameWithOutExt?: string;
    // nameWithExt?: string;
    // extension?: string;
    // url?: string;
    // size?: number;
    // creatorId?: number;
    // documentTypeId?: number;
  }
  export class Response {
    message: string;
    // file: IFile | undefined;
  }
}
