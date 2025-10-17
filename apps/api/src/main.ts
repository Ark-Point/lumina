import '@lumina/config';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformResponseInterceptor } from 'src/common/interceptor/transform-response.interceptor';
import { AppModule } from './app.module';
import { Environment } from './common/constant/environment';

async function bootstrap() {
  // 서버 시작 시 타임존 정보 출력
  console.log('=== Server Timezone Info ===');
  console.log('Date.toString():', new Date().toString());
  console.log(
    'System timezone:',
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  console.log('Process.env.TZ:', process.env.TZ || 'undefined');
  console.log('Timezone offset (minutes):', new Date().getTimezoneOffset());
  console.log('Current UTC time:', new Date().toISOString());
  console.log('Current local time:', new Date().toLocaleString());
  console.log('============================');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);

  const env = configService.get<Environment>('app.environment');

  const corsOption: CorsOptions = {};
  if (env === Environment.PROD) {
    corsOption.origin = configService.get('app.allowedCorsOrigins');
  } else {
    corsOption.origin = '*';
  }
  app.enableCors(corsOption);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Web3 Backend Template API')
    .setDescription('Web3 Backend Template API Documentation')
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addTag('queue', 'Queue management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('app.port')!;
  await app.listen(port, () => {
    console.log(corsOption.origin);
    console.log(`${env} server listening on ${port}`);
    console.log(
      `Swagger documentation available at http://localhost:${port}/api`,
    );
  });
}
bootstrap();
