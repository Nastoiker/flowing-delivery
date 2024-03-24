export namespace AccountLogin {
    const topic = 'account.register.command';
    export class Request {
        email: string;
        password: string;
    }
    export class Response {
        access_token: string;
    }
}
