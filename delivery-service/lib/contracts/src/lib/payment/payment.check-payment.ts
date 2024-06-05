// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CheckPayment {
  export const topic = 'payment.check-payment.command';
  export class Request {
    paymentId: string | undefined;
    token: string | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
