import { IFood } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FoodFindBySearch {
  export const topic = 'food.find-by-search.command';
  export class Request {
    search: string | undefined;
  }
  export class Response {
    foods: IFood[] | undefined;
  }
}
