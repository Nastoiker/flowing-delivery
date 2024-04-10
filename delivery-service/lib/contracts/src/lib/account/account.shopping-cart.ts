import { IShoppingCart } from '@delivery-service/interfaces';
import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AccountShoppingCart {
  export const topic = 'account.shopping-cart.query';

  export class Request {
    @IsNumber()
    userId: number | undefined;
  }

  export class Response {
    shoppingCart: IShoppingCart[] | undefined;
  }
}
