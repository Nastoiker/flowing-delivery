// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FileDelete {
  export const topic = 'file.delete.command';
  export class Request {
    id: string | undefined;
  }
  export class Response {
    success: boolean | undefined;
  }
}
