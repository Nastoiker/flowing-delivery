// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CategoryUpdate {
  export const topic = 'category.update.command';
  export class Request {
    id: number | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    pictures?: string | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
