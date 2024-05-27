import { IComment } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewsCommentsFindByFoodId {
  export const topic = 'review.find-comment-food-id.command';
  export class Request {
    sort: any | undefined;
    productId: number | undefined;
  }
  export class Response {
    comments: IComment[] | undefined;
  }
}
