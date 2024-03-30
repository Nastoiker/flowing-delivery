export namespace AccountRegister {
    const topic = 'account.register.command';
    export class Request {
        email: string | undefined;
        password: string | undefined;
    }
    export class Response {
        access_token: string | undefined;
    }
}
