import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventUpdateAllServiceNotifications {
  export const topic = 'event.update-all-service-notifications.command';

  export class Request {
    @IsNumber({}, { message: 'Id пользователя должен быть числом' })
    userId!: number;
  }

  export class Response {
    userId!: number;
  }
}
