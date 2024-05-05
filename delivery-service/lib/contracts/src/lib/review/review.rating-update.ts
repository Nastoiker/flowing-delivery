import { IRating } from '@delivery-service/interfaces';
import { IsNumber } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewRatingUpdate {
  export const topic = 'review.rating-update.command';
  export class Request {
    @IsNumber()
    id: number | undefined;
    @IsNumber()
    rating: number | undefined;
    @IsNumber()
    userId: number | undefined;
    @IsNumber()
    foodId: number | undefined;
  }
  export class Response {
    rating: IRating | undefined;
  }
}
