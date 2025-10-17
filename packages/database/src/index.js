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
var DatabaseModule_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.DatabaseModule = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
require('@lumina/config');
let DatabaseModule = (DatabaseModule_1 = class DatabaseModule {
  static forRoot(options) {
    const type = process.env.DATABASE_TYPE || 'postgres';
    const host = process.env.DATABASE_HOST || '127.0.0.1';
    const port = Number(process.env.DATABASE_PORT || 5432);
    const username = process.env.DATABASE_USER || 'postgres';
    const password = process.env.DATABASE_PASSWORD || 'postgres';
    const database = process.env.DATABASE_NAME || 'app';
    const logging = (process.env.DATABASE_LOGGING || 'false') === 'true';
    const baseConfig = {
      type,
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: true,
      logging,
      ...(options || {}),
    };
    return {
      module: DatabaseModule_1,
      imports: [typeorm_1.TypeOrmModule.forRoot(baseConfig)],
      exports: [typeorm_1.TypeOrmModule],
    };
  }
});
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule =
  DatabaseModule =
  DatabaseModule_1 =
    __decorate([(0, common_1.Global)(), (0, common_1.Module)({})], DatabaseModule);
//# sourceMappingURL=index.js.map
