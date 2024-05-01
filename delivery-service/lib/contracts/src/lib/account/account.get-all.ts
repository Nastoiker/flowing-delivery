import { IUser } from '@delivery-service/interfaces';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountGetAll {
  export const topic = 'account.get-all.command';
  export class Request {}
  export class Response {
    users: IUser[] | undefined;
  }
}
