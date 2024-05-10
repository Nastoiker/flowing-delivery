import { ICategory } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CategoryCreate {
  export const topic = 'category.create.command';
  export class Request {
    name: string | undefined;
    slug: string | undefined;
    pictures: string | undefined;
  }
  export class Response {
    category: ICategory | undefined;
  }
}
