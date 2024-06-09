import { IEvent } from '@delivery-service/interfaces';
import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventUpdateServiceNotification {
  export const topic = 'event.update-service-notification.command';

  export class Request {
    @IsNumber({}, { message: 'Id уведомления должно быть числом' })
    id!: number;
  }

  export class Response {
    notification!: IEvent;
  }
}
