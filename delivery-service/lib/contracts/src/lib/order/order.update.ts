import { IFile } from '@nestjs/common/pipes/file/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderUpdate {
  export const topic = 'order.update.command';
  export class Request {
    id: number | undefined;
    status?: string | undefined;
    picture?: string | undefined;
    deliveryPrice?: number | undefined;
    priceFood?: number | undefined;
    totalPrice?: number | undefined;
    userId?: number | undefined;
  }
  export class Response {
    file: IFile | undefined;
  }
}
