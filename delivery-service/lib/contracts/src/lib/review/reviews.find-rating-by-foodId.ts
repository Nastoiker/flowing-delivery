import { IRating } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewsRatingsFindByFoodId {
  export const topic = 'review.find-ratings-food-id.command';
  export class Request {
    foodId: number | undefined;
  }
  export class Response {
    ratings: IRating[] | undefined;
  }
}
