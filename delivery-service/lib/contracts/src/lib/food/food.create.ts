import { IFood } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FoodCreate {
  export const topic = 'food.create.command';
  export class Request {
    food: IFood | undefined;
  }
  export class Response {
    food: IFood | undefined;
  }
}
