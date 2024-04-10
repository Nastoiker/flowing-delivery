import { IFood } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FoodFindById {
  export const topic = 'food.find-id.command';
  export class Request {
    id: number;
  }
  export class Response {
    foods: IFood | undefined;
  }
}
