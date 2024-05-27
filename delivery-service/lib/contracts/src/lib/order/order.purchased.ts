import { IOrder } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderGetPurchsedByUserId {
  export const topic = 'order.purchased.command';
  export class Request {
    userId: number | undefined;
  }
  export class Response {
    orders: IOrder[] | undefined;
    allCount: number | undefined;
  }
}
