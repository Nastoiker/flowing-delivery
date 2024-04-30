import { IShoppingCart } from '@delivery-service/interfaces';
import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoppingCardCreate {
  export const topic = 'shopping-card.create.command';

  export class Request {
    @IsNumber()
    userId: number | undefined;
    @IsNumber()
    productId: number | undefined;
    @IsNumber()
    totalPrice: number | undefined;
    @IsNumber()
    count: number | undefined;
  }

  export class Response {
    shoppingCard: IShoppingCart | undefined;
  }
}
