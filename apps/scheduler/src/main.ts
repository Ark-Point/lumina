import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'warn', 'error'],
  });

  await app.listen(process.env.SCHEDULER_PORT ?? 8002);
}

bootstrap();
