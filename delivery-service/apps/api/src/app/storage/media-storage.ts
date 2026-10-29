import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { path } from 'app-root-path';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';

export const MEDIA_STORAGE = Symbol('MEDIA_STORAGE');
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MEDIA_KEY =
  /^\d{4}-\d{2}-\d{2}\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(png|jpg|webp|gif)$/;
export const IMAGE_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
};

export interface StorageSettings {
  driver: 'local' | 's3';
  localRoot: string;
  bucket?: string;
  region: string;
  endpoint?: string;
  forcePathStyle: boolean;
}

export function storageSettings(config: ConfigService): StorageSettings {
  const driver = config.get<string>('STORAGE_DRIVER') ?? 'local';
  if (driver !== 'local' && driver !== 's3')
    throw new Error('STORAGE_DRIVER must be local or s3');
  const bucket = config.get<string>('S3_BUCKET');
  if (driver === 's3' && !bucket)
    throw new Error('S3_BUCKET is required for s3 storage');
  const endpoint = config.get<string>('S3_ENDPOINT') || undefined;
  if (endpoint) {
    const url = new URL(endpoint);
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/'
    )
      throw new Error('Invalid S3_ENDPOINT');
  }
  const forcePathStyle = config.get<string>('S3_FORCE_PATH_STYLE') ?? 'false';
  if (!['true', 'false'].includes(forcePathStyle))
    throw new Error('S3_FORCE_PATH_STYLE must be true or false');
  return {
    driver,
    bucket,
    endpoint,
    localRoot: join(path, 'uploads'),
    region: config.get<string>('AWS_REGION') || 'us-east-1',
    forcePathStyle: forcePathStyle === 'true',
  };
}

/** Private S3 bucket, public catalog media through the API. Never use for private documents. */
export class MediaStorage {
  private readonly client?: S3Client;
  constructor(private readonly settings: StorageSettings, client?: S3Client) {
    this.client =
      client ??
      (settings.bucket
        ? new S3Client({
            region: settings.region,
            endpoint: settings.endpoint,
            forcePathStyle: settings.forcePathStyle,
            maxAttempts: 3,
            // Use the SDK credential chain: IAM role or standard AWS_* environment variables.
            requestHandler: { connectionTimeout: 3000, requestTimeout: 15000 },
          })
        : undefined);
  }

  async put(key: string, body: Buffer, contentType: string): Promise<string> {
    if (!MEDIA_KEY.test(key)) throw new Error('Invalid generated media key');
    if (this.settings.driver === 'local') {
      const target = join(this.settings.localRoot, key);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, body, { flag: 'wx' });
      return `/uploads/${key}`;
    }
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.settings.bucket,
          Key: `media/${key}`,
          Body: body,
          ContentType: contentType,
          ContentLength: body.length,
          CacheControl: 'public, max-age=31536000, immutable',
          IfNoneMatch: '*',
        }),
        { abortSignal: AbortSignal.timeout(20000) }
      );
    } catch {
      // Never fall back to local disk or expose credentials/endpoints on failure.
      throw new ServiceUnavailableException('Image storage unavailable');
    }
    return `/api/media/s3/${key}`;
  }

  async openS3(
    key: string
  ): Promise<{ stream: Readable; type: string; length?: number }> {
    if (!MEDIA_KEY.test(key) || !this.client || !this.settings.bucket)
      throw new NotFoundException();
    try {
      const result = await this.client.send(
        new GetObjectCommand({
          Bucket: this.settings.bucket,
          Key: `media/${key}`,
        }),
        { abortSignal: AbortSignal.timeout(20000) }
      );
      if (!(result.Body instanceof Readable))
        throw new Error('Missing object body');
      return {
        stream: result.Body,
        type: IMAGE_TYPES[key.split('.').pop()],
        length: result.ContentLength,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey')
        throw new NotFoundException();
      throw new ServiceUnavailableException('Image storage unavailable');
    }
  }

  onModuleDestroy() {
    this.client?.destroy();
  }
}

export const mediaStorageProvider = {
  provide: MEDIA_STORAGE,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    new MediaStorage(storageSettings(config)),
};
