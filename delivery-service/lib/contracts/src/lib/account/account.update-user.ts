import { IUser } from '@delivery-service/interfaces';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountUpdateUser {
  export const topic = 'account.update-user.command';
  export class Request {
    user: Partial<IUser> | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
