import { IUser } from '@delivery-service/interfaces';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountUpdate {
  export const topic = 'account.update.command';
  export class Request {
    user: Partial<IUser> | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
