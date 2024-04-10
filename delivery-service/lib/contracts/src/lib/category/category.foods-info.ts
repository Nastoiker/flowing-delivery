import { ICategory, IFood } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CategoryFoodsInfo {
  export const topic = 'category.foods-info.command';
  export class Request {
    categoryId: number | undefined;
  }
  export class Response {
    category: ICategory | undefined;
    foods: IFood[] | undefined;
  }
}
