// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderUpdate {
  export const topic = 'order.update.command';
  export class Request {
    id: number | undefined;
    deliveryAddress?: string | undefined;
    isPickUp?: boolean | undefined;
    status?: string | undefined;
    deliveryPrice?: number | undefined;
    priceFood?: number | undefined;
    totalPrice?: number | undefined;
  }
  export class Response {
    message: string | undefined;
    userId: number | undefined;
  }
}
