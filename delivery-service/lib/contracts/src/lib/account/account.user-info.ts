import { IUser } from '@delivery-service/interfaces';
import { IsString } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountUserInfo {
  export const topic = 'account.user-info.query';

  export class Request {
    @IsString()
    id: string | undefined;
  }

  export class Response {
    profile: Omit<IUser, 'passwordHash'> | undefined;
  }
}
