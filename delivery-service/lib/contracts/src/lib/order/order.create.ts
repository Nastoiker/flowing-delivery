import { IOrder } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderCreate {
  export const topic = 'order.create.command';
  export class Request {
    deliveryAddress?: string;
    isPickUp?: boolean;
    status: string | undefined;
    deliveryPrice: number | undefined;
    priceFood: number | undefined;
    totalPrice: number | undefined;
    userId: number | undefined;
  }
  export class Response {
    order: IOrder | undefined;
  }
}
