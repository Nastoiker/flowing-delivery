import { IComment } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewsCommentsFindByUserId {
  export const topic = 'review.find-comments-userId.command';
  export class Request {
    userId: number | undefined;
  }
  export class Response {
    comments: IComment[] | undefined;
  }
}
