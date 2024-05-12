import { IFood } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FoodGetAll {
  export const topic = 'food.get-all.command';
  export class Request {
    sort: any | undefined;
    filter: any | undefined;
    page: number | undefined;
    pageSize: number | undefined;
  }
  export class Response {
    foods: IFood[] | undefined;
  }
}
