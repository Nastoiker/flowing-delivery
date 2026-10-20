/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Allow Nest providers to close connections when Kubernetes sends SIGTERM.
  app.enableShutdownHooks();
  const configService = new ConfigService();
  await app.init();
  Logger.log(`🚀 Event is running`);
}

bootstrap();
