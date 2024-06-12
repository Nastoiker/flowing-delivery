import { IEvent } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventAddServiceNotification {
  export const topic = 'event.add-service-notification.command';

  export class Request {
    type: string | undefined;
    message: string | undefined;
    userId: number | undefined;
    priority: string | undefined;
  }
  export class Response {
    event: IEvent | undefined;
  }
}
