import { IShoppingCart } from '@delivery-service/interfaces';
import { IsObject } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoppingCardUpdate {
  export const topic = 'shopping-card.update.command';

  export class Request {
    @IsObject()
    id: Partial<IShoppingCart> | undefined;
  }

  export class Response {
    shoppingCard: IShoppingCart | undefined;
  }
}
