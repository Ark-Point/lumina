import { Module } from '@nestjs/common';
import { CMCModule } from 'src/services/cmc/cmc.module';
import { CMCApiSchedulerJob } from './cmc.scheduler.job';

@Module({
  imports: [CMCModule],
  providers: [CMCApiSchedulerJob],
})
export class CMCSchedulerModule {}
