// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RatingRemove {
  export const topic = 'review.rating-remove.command';
  export class Request {
    id: number | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
