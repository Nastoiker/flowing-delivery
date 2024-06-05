// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PaymentNotify {
  export const topic = 'payment.notify.command';
  export class Request {
    operation_id: number | undefined;
    datetime: string | undefined;
    sha1_hash: string | undefined;
    sender?: number | undefined;
    amount: number | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
