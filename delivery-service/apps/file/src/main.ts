/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { FilesModule } from './app/fiole.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesModule);
  await app.init();
}

bootstrap();
