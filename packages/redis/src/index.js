'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var RedisModule_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.RedisModule = exports.REDIS_CLIENT = void 0;
const common_1 = require('@nestjs/common');
const config_1 = require('@nestjs/config');
const ioredis_1 = require('ioredis');
require('@lumina-backend/config');
exports.REDIS_CLIENT = Symbol('REDIS_CLIENT');
let RedisModule = (RedisModule_1 = class RedisModule {
  static forRoot(options) {
    const url = options?.url || process.env.REDIS_URL;
    const host = options?.host || process.env.REDIS_HOST || '127.0.0.1';
    const port = options?.port || Number(process.env.REDIS_PORT || 6379);
    const password = options?.password || process.env.REDIS_PASSWORD;
    const db = options?.db || Number(process.env.REDIS_DB || 0);
    const bullMqSafeDefaults = {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };
    const mergedOptions = {
      ...bullMqSafeDefaults,
      ...(options?.options || {}),
    };
    const client = url
      ? new ioredis_1.default(url, mergedOptions)
      : new ioredis_1.default({ host, port, password, db, ...mergedOptions });
    return {
      module: RedisModule_1,
      imports: [config_1.ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        {
          provide: exports.REDIS_CLIENT,
          useValue: client,
        },
      ],
      exports: [exports.REDIS_CLIENT],
    };
  }
});
exports.RedisModule = RedisModule;
exports.RedisModule =
  RedisModule =
  RedisModule_1 =
    __decorate([(0, common_1.Global)(), (0, common_1.Module)({})], RedisModule);
//# sourceMappingURL=index.js.map
