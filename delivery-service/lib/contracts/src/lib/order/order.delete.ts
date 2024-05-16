// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderDelete {
  export const topic = 'order.delete.command';
  export class Request {
    id: number | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
