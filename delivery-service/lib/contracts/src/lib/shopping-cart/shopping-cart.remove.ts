import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoppingCardRemove {
  export const topic = 'shopping-card.remove.command';

  export class Request {
    @IsNumber()
    id: number | undefined;
  }

  export class Response {
    message: string | undefined;
  }
}
