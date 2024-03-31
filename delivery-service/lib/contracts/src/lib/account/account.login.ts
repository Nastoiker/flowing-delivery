import { IsEmail, IsString } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountLogin {
  export const topic = 'account.login.command';
  export class Request {
    @IsEmail()
    email: string | undefined;
    @IsString()
    password: string | undefined;
  }
  export class Response {
    access_token: string | undefined;
  }
}
