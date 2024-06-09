import { IEvent } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventCreate {
  export const topic = 'event.create.command';
  export class Request {
    type: string | undefined;
    message: string | undefined;
    priority: string | undefined;
  }
  export class Response {
    event: IEvent | undefined;
  }
}
