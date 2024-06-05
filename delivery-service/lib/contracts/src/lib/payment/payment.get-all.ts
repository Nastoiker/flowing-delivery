// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Payment {
  export const topic = 'payment.get-all.command';
  export class Request {}
  export class Response {
    // TODO
    payments: any[] | undefined;
  }
}
