import { ICategory } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CategoryGetAll {
  export const topic = 'category.get-all.command';
  export class Request {}
  export class Response {
    categories: ICategory[] | undefined;
  }
}
