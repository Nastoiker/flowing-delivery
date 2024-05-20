import { IOrder } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderGetPendingByUserId {
  export const topic = 'order.get-pending-by-userId.command';
  export class Request {
    userId: number | undefined;
  }
  export class Response {
    order: IOrder[] | undefined;
  }
}
