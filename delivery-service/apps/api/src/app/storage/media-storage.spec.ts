import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  NotFoundException,
  PayloadTooLargeException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import sharp from 'sharp';
import { FilesService } from '../file.service';
import {
  MAX_IMAGE_BYTES,
  MediaStorage,
  storageSettings,
  StorageSettings,
} from './media-storage';

describe('Media storage', () => {
  let root: string;
  let png: Buffer;
  let settings: StorageSettings;
  const key = '2026-10-29/3df43e00-87cc-4dd3-9cf3-ac64f953c636.png';

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'delivery-media-'));
    png = await sharp({
      create: { width: 1, height: 1, channels: 3, background: '#ffffff' },
    })
      .png()
      .toBuffer();
    settings = {
      driver: 'local',
      localRoot: root,
      region: 'us-east-1',
      forcePathStyle: false,
    };
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('uses generated paths and real content type; same names never overwrite', async () => {
    const files = new FilesService(new MediaStorage(settings));
    const results = await Promise.all(
      [1, 2].map(() =>
        files.saveFile({ originalname: '../../escape.jpg', buffer: png })
      )
    );
    expect(results[0].url).not.toBe(results[1].url);
    for (const result of results) {
      expect(result.url).toMatch(
        /^\/uploads\/\d{4}-\d{2}-\d{2}\/[a-f0-9-]+\.png$/
      );
      expect(
        await readFile(join(root, result.url.replace('/uploads/', '')))
      ).toEqual(png);
    }
  });

  it('rejects missing, spoofed, SVG and oversized images before writing', async () => {
    const files = new FilesService(new MediaStorage(settings));
    await expect(files.saveFile(undefined)).rejects.toBeInstanceOf(
      BadRequestException
    );
    await expect(
      files.saveFile({
        originalname: 'x.png',
        buffer: Buffer.from('not an image'),
      })
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      files.saveFile({
        originalname: 'x.svg',
        buffer: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
        ),
      })
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      files.saveFile({
        originalname: 'x.png',
        buffer: Buffer.alloc(MAX_IMAGE_BYTES + 1),
      })
    ).rejects.toBeInstanceOf(PayloadTooLargeException);
    expect(await readdir(root)).toEqual([]);
  });

  it('uploads to a private bucket with a stable relative URL and no ACL', async () => {
    const send = jest.fn().mockResolvedValue({});
    const client = { send } as unknown as S3Client;
    const storage = new MediaStorage(
      { ...settings, driver: 's3', bucket: 'catalog' },
      client
    );
    expect(await storage.put(key, png, 'image/png')).toBe(
      `/api/media/s3/${key}`
    );
    const command = send.mock.calls[0][0] as PutObjectCommand;
    expect(command).toBeInstanceOf(PutObjectCommand);
    expect(command.input).toMatchObject({
      Bucket: 'catalog',
      Key: `media/${key}`,
      Body: png,
      ContentType: 'image/png',
      IfNoneMatch: '*',
    });
    expect(command.input.ACL).toBeUndefined();
    expect(await readdir(root)).toEqual([]);
  });

  it('does not fall back to local disk or leak S3 errors', async () => {
    const client = {
      send: jest.fn().mockRejectedValue(new Error('credentials-and-endpoint')),
    } as unknown as S3Client;
    const storage = new MediaStorage(
      { ...settings, driver: 's3', bucket: 'catalog' },
      client
    );
    await expect(storage.put(key, png, 'image/png')).rejects.toThrow(
      'Image storage unavailable'
    );
    expect(await readdir(root)).toEqual([]);
  });

  it('streams old S3 URLs even after switching new writes to local', async () => {
    const stream = Readable.from(png);
    const send = jest
      .fn()
      .mockResolvedValue({ Body: stream, ContentLength: png.length });
    const storage = new MediaStorage({ ...settings, bucket: 'catalog' }, {
      send,
    } as unknown as S3Client);
    const result = await storage.openS3(key);
    expect(result).toEqual({ stream, length: png.length, type: 'image/png' });
    expect(send.mock.calls[0][0]).toBeInstanceOf(GetObjectCommand);
  });

  it('rejects traversal and restricts reads to generated public media keys', async () => {
    const send = jest.fn();
    const storage = new MediaStorage({ ...settings, bucket: 'catalog' }, {
      send,
    } as unknown as S3Client);
    await expect(storage.openS3('../private/document')).rejects.toBeInstanceOf(
      NotFoundException
    );
    await expect(
      storage.put('../escape.png', png, 'image/png')
    ).rejects.toThrow('Invalid generated');
    expect(send).not.toHaveBeenCalled();
  });

  it('distinguishes missing objects from storage failures', async () => {
    const send = jest
      .fn()
      .mockRejectedValue(
        Object.assign(new Error('missing'), { name: 'NoSuchKey' })
      );
    const storage = new MediaStorage({ ...settings, bucket: 'catalog' }, {
      send,
    } as unknown as S3Client);
    await expect(storage.openS3(key)).rejects.toBeInstanceOf(NotFoundException);
    send.mockRejectedValue(new Error('timeout'));
    await expect(storage.openS3(key)).rejects.toBeInstanceOf(
      ServiceUnavailableException
    );
  });

  it('fails fast on invalid S3 configuration', () => {
    expect(storageSettings(new ConfigService({})).driver).toBe('local');
    for (const config of [
      { STORAGE_DRIVER: 'typo' },
      { STORAGE_DRIVER: 's3' },
      { S3_ENDPOINT: 'http://user:password@localhost' },
      { S3_ENDPOINT: 'ftp://localhost' },
      { S3_FORCE_PATH_STYLE: 'yes' },
    ])
      expect(() => storageSettings(new ConfigService(config))).toThrow();
  });
});
