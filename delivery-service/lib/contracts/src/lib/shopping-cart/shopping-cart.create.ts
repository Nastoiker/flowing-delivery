import { IShoppingCart } from '@delivery-service/interfaces';
import { IsObject } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoppingCardCreate {
  export const topic = 'shopping-card.create.command';

  export class Request {
    @IsObject()
    shoppingCard: Partial<IShoppingCart> | undefined;
  }

  export class Response {
    shoppingCard: IShoppingCart | undefined;
  }
}
