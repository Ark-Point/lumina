import '@lumina/config';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
    Chain,
    DexInfo,
    DexProtocol,
    PerpInfo,
    PerpProtocol,
    Protocol,
    StableCoin,
    YieldPool,
} from './entities';
import { CMCCryptoCurrency } from './entities/cmc-cryptocurrency.entity';
import { FeeInfo } from './entities/feeinfo.entity';
import { FeeProtocol } from './entities/feeprotocol.entity';
import {
    ChainRepository,
    DexInfoRepository,
    DexProtocolRepository,
    PerpInfoRepository,
    PerpProtocolRepository,
    ProtocolRepository,
    StableCoinRepository,
    YieldPoolRepository,
} from './repositories';
import { CMCCryptoCurrencyRepository } from './repositories/cmc-cryptocurrency.repository';
import { FeeInfoRepository } from './repositories/feeinfo.repository';
import { FeeProtocolRepository } from './repositories/feeprotocol.repository';

// Export entities
export * from './entities';

// Export repositories
export * from './repositories';

export type DatabaseModuleOptions = Partial<TypeOrmModuleOptions>;

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options?: DatabaseModuleOptions): DynamicModule {
    const type = (process.env.DATABASE_TYPE || 'postgres') as any;
    const host = process.env.DATABASE_HOST || '127.0.0.1';
    const port = Number(process.env.DATABASE_PORT || 5432);
    const username = process.env.DATABASE_USER || 'postgres';
    const password = process.env.DATABASE_PASSWORD || 'postgres';
    const database = process.env.DATABASE_NAME || 'app';
    const logging = (process.env.DATABASE_LOGGING || 'false') === 'true';

    const baseConfig: TypeOrmModuleOptions = {
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
    } as TypeOrmModuleOptions;

    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forRoot(baseConfig)],
      exports: [TypeOrmModule],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forFeature([
          Chain,
          Protocol,
          StableCoin,
          YieldPool,
          DexProtocol,
          DexInfo,
          FeeInfo,
          FeeProtocol,
          PerpInfo,
          PerpProtocol,
          CMCCryptoCurrency,
        ]),
      ],
      providers: [
        ChainRepository,
        ProtocolRepository,
        StableCoinRepository,
        YieldPoolRepository,
        DexProtocolRepository,
        DexInfoRepository,
        FeeInfoRepository,
        FeeProtocolRepository,
        PerpInfoRepository,
        PerpProtocolRepository,
        CMCCryptoCurrencyRepository,
      ],
      exports: [
        TypeOrmModule,
        ChainRepository,
        ProtocolRepository,
        StableCoinRepository,
        YieldPoolRepository,
        DexProtocolRepository,
        DexInfoRepository,
        FeeInfoRepository,
        FeeProtocolRepository,
        PerpInfoRepository,
        PerpProtocolRepository,
        CMCCryptoCurrencyRepository,
        // Chain,
        // Protocol,
        // StableCoin,
        // YieldPool,
        // DexProtocol,
        // DexInfo,
      ],
    };
  }
}
