import { ImageOptions, ImageRequirement, ImageResult } from './models';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GenerateImages {
  export const Topic = 'file.generate-image.command';

  export class Request {
    image: string | undefined;
    requirements: ImageRequirement[] | undefined;
    options?: ImageOptions | undefined;
  }

  export class Response {
    images: ImageResult[] | undefined;
  }
}
