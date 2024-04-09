import { IUser } from '@delivery-service/interfaces';
import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountUserInfo {
  export const topic = 'account.user-info.query';

  export class Request {
    @IsNumber()
    id: number | undefined;
  }

  export class Response {
    profile: Omit<IUser, 'password'> | undefined;
  }
}
