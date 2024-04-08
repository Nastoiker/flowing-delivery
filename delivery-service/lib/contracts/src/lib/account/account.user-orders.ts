import { IUserCourses } from '@delivery-service/interfaces';
import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountUserCourses {
  export const topic = 'account.user-orders.query';

  export class Request {
    @IsNumber()
    id: number | undefined;
  }

  export class Response {
    courses: IUserCourses[] | undefined;
  }
}
