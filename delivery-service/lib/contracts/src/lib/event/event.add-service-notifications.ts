import { IEvent } from '@delivery-service/interfaces';
import { IsArray } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventAddServiceNotifications {
  export const topic = 'event.add-service-notifications.command';

  export class Request {
    @IsArray({ message: 'Id пользователей должны быть массивом чисел' })
    userIds!: number[];
    type: string | undefined;
    message: string | undefined;
    priority: string | undefined;
  }

  export class Response {
    event: IEvent[] | undefined;
  }
}

export interface IAddServiceNotifications {
  userIds: number[];
  title: string;
  description: string;
  text: string;
}
