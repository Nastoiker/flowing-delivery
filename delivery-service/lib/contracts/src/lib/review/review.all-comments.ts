import { IComment } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewAllComments {
  export const topic = 'review.all-comments.command';
  export class Request {
    sort: any | undefined;
    filter: any | undefined;
    page: number | undefined;
    pageSize: number | undefined;
  }
  export class Response {
    allCount: number | undefined;
    comments: IComment[] | undefined;
  }
}
