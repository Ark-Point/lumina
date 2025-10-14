import '@lumina-backend/config';
import { DatabaseModule } from '@lumina-backend/database';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiDefiLlamaModule } from './services/defiLlama/api.defillama.module';
import { DefiLlamaSchedulerModule } from './services/schedulers/defillama.module';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature(),
    ScheduleModule.forRoot(), // 크론/인터벌 구동
    // Domain API services only
    ApiDefiLlamaModule,

    // Schedulers
    DefiLlamaSchedulerModule,
  ],
})
export class AppModule {}
