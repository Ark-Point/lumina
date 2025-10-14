import '@lumina-backend/config';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

export interface RedisModuleOptions {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  options?: RedisOptions;
}

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Global()
@Module({})
export class RedisModule {
  static forRoot(options?: RedisModuleOptions): DynamicModule {
    const url = options?.url || process.env.REDIS_URL;
    const host = options?.host || process.env.REDIS_HOST || '127.0.0.1';
    const port = options?.port || Number(process.env.REDIS_PORT || 6379);
    const password = options?.password || process.env.REDIS_PASSWORD;
    const db = options?.db || Number(process.env.REDIS_DB || 0);

    const bullMqSafeDefaults: RedisOptions = {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    } as RedisOptions;

    const mergedOptions: RedisOptions = {
      ...bullMqSafeDefaults,
      ...(options?.options || {}),
    } as RedisOptions;

    const client = url
      ? new Redis(url, mergedOptions)
      : new Redis({ host, port, password, db, ...mergedOptions });

    return {
      module: RedisModule,
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        {
          provide: REDIS_CLIENT,
          useValue: client,
        },
      ],
      exports: [REDIS_CLIENT],
    };
  }
}
