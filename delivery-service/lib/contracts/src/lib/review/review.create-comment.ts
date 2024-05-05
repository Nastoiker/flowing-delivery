import { IsNumber, IsString } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewCommentCreate {
  export const topic = 'review.create-comment.command';
  export class Request {
    @IsString()
    title: string | undefined;
    @IsNumber()
    userId: number | undefined;
    @IsNumber()
    productId: number | undefined;
    @IsString()
    description: string | undefined;
  }
  export class Response {
    message: string | undefined;
  }
}
