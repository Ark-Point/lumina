import '@lumina-backend/config';
import { DatabaseModule } from '@lumina-backend/database';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CMCModule } from './services/cmc/cmc.module';
import { ApiDefiLlamaModule } from './services/defiLlama/api.defillama.module';
import { CMCSchedulerModule } from './services/schedulers/cmc/cmc.module';
import { DefiLlamaSchedulerModule } from './services/schedulers/defiLlama/defillama.module';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature(),
    ScheduleModule.forRoot(), // 크론/인터벌 구동
    // Domain API services only
    ApiDefiLlamaModule,
    CMCModule,

    // Schedulers
    DefiLlamaSchedulerModule,
    CMCSchedulerModule,
  ],
})
export class AppModule {}
