import { IRating } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewsRatingFindByUserId {
  export const topic = 'review.find-rating-userId.command';
  export class Request {
    userId: number | undefined;
  }
  export class Response {
    ratings: IRating[] | undefined;
  }
}
