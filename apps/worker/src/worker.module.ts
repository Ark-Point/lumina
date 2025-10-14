import '@lumina-backend/config';
import { DatabaseModule } from '@lumina-backend/database';
import { RedisModule } from '@lumina-backend/redis';
import { Module } from '@nestjs/common';
import { QueueModule } from './worker/queue.module';

@Module({
  imports: [RedisModule.forRoot(), DatabaseModule.forRoot(), QueueModule],
})
export class WorkerModule {}
