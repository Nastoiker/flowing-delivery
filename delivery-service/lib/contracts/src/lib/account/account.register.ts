// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountRegister {
  export const topic = 'account.register.command';
  export class Request {
    email: string | undefined;
    password: string | undefined;
    name: string | undefined;
    surname: string | undefined;
    username: string | undefined;
    displayName?: string | undefined;
  }
  export class Response {
    email: string | undefined;
  }
}
