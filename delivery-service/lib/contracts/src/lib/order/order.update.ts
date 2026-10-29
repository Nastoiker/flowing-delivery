// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderUpdate {
  export const topic = 'order.update.command';
  export class Request {
    id: number | undefined;
    status?: string | undefined;
  }
  export class Response {
    message: string | undefined;
    userId: number | undefined;
  }
}
