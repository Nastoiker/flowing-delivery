import { IsNumber } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewRatingCreate {
  export const topic = 'review.create-rating.command';
  export class Request {
    @IsNumber()
    rating: number | undefined;
    @IsNumber()
    userId: number | undefined;
    @IsNumber()
    foodId: number | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
