import { IBanner } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BannerGetAll {
  export const topic = 'banner.get-all.command';
  export class Request {}
  export class Response {
    banner: IBanner[] | undefined;
  }
}
