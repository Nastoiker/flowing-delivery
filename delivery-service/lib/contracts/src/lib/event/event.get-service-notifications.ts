import { IEvent } from '@delivery-service/interfaces';
import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventGetServiceNotifications {
  export const topic = 'event.get-service-notifications.query';

  export class Request {
    @IsNumber({}, { message: 'Id пользователя должно быть числом' })
    userId!: number;
  }

  export class Response {
    notifications!: IEvent[];
  }
}
