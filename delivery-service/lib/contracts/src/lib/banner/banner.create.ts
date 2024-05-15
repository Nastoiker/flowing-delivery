import { IBanner } from '@delivery-service/interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BannerCreate {
  export const topic = 'banner.create.command';
  export class Request {
    link: string | undefined;
    picture: string | undefined;
    priority: number | undefined;
    alt: string | undefined;
  }
  export class Response {
    banner: IBanner | undefined;
  }
}
