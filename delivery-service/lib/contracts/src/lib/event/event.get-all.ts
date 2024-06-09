import { IEvent } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventGetAll {
  export const topic = 'event.get-all.command';
  export class Request {}
  export class Response {
    events: IEvent[] | undefined;
  }
}
