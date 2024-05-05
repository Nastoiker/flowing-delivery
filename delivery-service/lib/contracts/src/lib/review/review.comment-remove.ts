// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewCommentRemove {
  export const topic = 'review.comment-remove.command';
  export class Request {
    id: number | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
