import { IRating } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewAllRatings {
  export const topic = 'review.all-ratings.command';
  export class Request {
    sort: any | undefined;
    filter: any | undefined;
  }
  export class Response {
    ratings: IRating[] | undefined;
  }
}
