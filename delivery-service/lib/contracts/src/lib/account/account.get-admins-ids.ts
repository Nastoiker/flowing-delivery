// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountGetAdminsAll {
  export const topic = 'account.get-admins-ids.command';
  export class Request {}
  export class Response {
    ids: number[] | undefined;
  }
}
