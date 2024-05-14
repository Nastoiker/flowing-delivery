// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FoodDeleteById {
  export const topic = 'food.delete.command';
  export class Request {
    id: number | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
