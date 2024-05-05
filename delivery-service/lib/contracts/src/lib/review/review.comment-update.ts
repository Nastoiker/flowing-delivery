import { IComment } from '@delivery-service/interfaces';
import { IsNumber, IsOptional, IsString } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReviewCommentUpdate {
  export const topic = 'review.comment-update.command';
  export class Request {
    @IsNumber()
    id: number | undefined;
    @IsString()
    @IsOptional()
    title: string | undefined;
    @IsNumber()
    @IsOptional()
    productId: number | undefined;
    @IsString()
    @IsOptional()
    description: string | undefined;
  }
  export class Response {
    comment: IComment | undefined;
  }
}
