import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventGetUnreadServiceNotifications {
  export const topic = 'event.get-unread-service-notifications.query';

  export class Request {
    @IsNumber({}, { message: 'Id пользователя должно быть числом' })
    userId!: number;
  }

  export class Response {
    hasUnreadNotifications!: number;
  }
}
