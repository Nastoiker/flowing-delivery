import { IBanner } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BannerDelete {
  export const topic = 'category.delete.command';
  export class Request {
    id: number | undefined;
  }
  export class Response {
    banner: IBanner[] | undefined;
  }
}
