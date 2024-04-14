// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FileUpload {
  export const topic = 'file.upload.command';
  export class Request {
    file: any;
    // file: Express.Multer.File | undefined;
  }
  export class Response {
    // file: IFile | undefined;
    message: string;
  }
}
