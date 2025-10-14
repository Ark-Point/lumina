import { REDIS_CLIENT } from '@lumina-backend/redis';
import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { Queue, QueueOptions, Worker } from 'bullmq';

export const JOB_QUEUE = 'jobs';

@Module({})
export class QueueModule implements OnModuleInit {
  private readonly logger = new Logger(QueueModule.name);
  private queue!: Queue;
  private worker!: Worker;

  constructor(@Inject(REDIS_CLIENT) private readonly redis: any) {}

  onModuleInit() {
    const connection = this.redis; // ioredis instance
    const queueOptions: QueueOptions = { connection } as any;
    this.queue = new Queue(JOB_QUEUE, queueOptions);

    this.worker = new Worker(
      JOB_QUEUE,
      async (job) => {
        this.logger.log(`Processing job ${job.id} of type ${job.name}`);
        return { ok: true };
      },
      { connection },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed: ${err.message}`);
    });

    this.logger.log(`Queue and Worker initialized (queue=${JOB_QUEUE})`);
  }
}
