/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { seedCategories } from './app/category/category.seed';
import { startSeedFood } from './app/food/food.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // При SIGTERM от Kubernetes вызываем обработчики завершения провайдеров Nest.
  app.enableShutdownHooks();
  await app.init();
  const hasCategories = await seedCategories();
  if (hasCategories) {
    await startSeedFood();
  }
}

bootstrap();
