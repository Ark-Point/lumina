import { Module } from '@nestjs/common';
import { ApiDefiLlamaModule } from '../../defiLlama/api.defillama.module';
import { DefiLlamaApiSchedulerJob } from './defillama.scheduler.job';

@Module({
  imports: [ApiDefiLlamaModule],
  providers: [DefiLlamaApiSchedulerJob],
})
export class DefiLlamaSchedulerModule {}
