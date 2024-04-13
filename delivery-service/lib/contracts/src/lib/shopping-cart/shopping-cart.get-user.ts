import { IShoppingCart } from '@delivery-service/interfaces';
import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoppingCardGetByUserId {
  export const topic = 'shopping-card.get-user.query';

  export class Request {
    @IsNumber()
    userId: number | undefined;
  }

  export class Response {
    shoppingCard: IShoppingCart | undefined;
  }
}
