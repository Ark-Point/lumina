import { Controller } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  // @Get('enqueue')
  // async enqueue() {
  //   const queue = new Queue(JOB_QUEUE);
  //   await queue.add('test', { now: Date.now() });
  //   return { ok: true };
  // }
}
