import { IOrder } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderGetAll {
  export const topic = 'order.get-all.command';
  export class Request {}
  export class Response {
    orders: IOrder[] | undefined;
  }
}
