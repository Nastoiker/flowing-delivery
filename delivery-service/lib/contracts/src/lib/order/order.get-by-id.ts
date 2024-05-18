import { IOrder } from "@delivery-service/interfaces";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderFindById {
  export const topic = 'order.find-id.command';
  export class Request {
    id: number | undefined;
  }
  export class Response {
    order: IOrder | undefined;
  }
}
