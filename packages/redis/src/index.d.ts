import '@lumina-backend/config';
import { DynamicModule } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
export interface RedisModuleOptions {
    url?: string;
    host?: string;
    port?: number;
    password?: string;
    db?: number;
    options?: RedisOptions;
}
export declare const REDIS_CLIENT: unique symbol;
export declare class RedisModule {
    static forRoot(options?: RedisModuleOptions): DynamicModule;
}
