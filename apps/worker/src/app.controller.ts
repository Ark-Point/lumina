import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bullmq';
import { JOB_QUEUE } from './worker/queue.module';

@Controller()
export class AppController {
  constructor() {}

  @Get('enqueue')
  async enqueue() {
    const queue = new Queue(JOB_QUEUE);
    await queue.add('test', { now: Date.now() });
    return { ok: true };
  }
}
