import { ICategory } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CategoryCreate {
  export const topic = 'category.create.command';
  export class Request {
    category: Partial<ICategory> | undefined;
  }
  export class Response {
    category: ICategory | undefined;
  }
}
