import { Body, Controller, Head, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorator/public.decorator';
import { Queue } from 'bullmq';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

const JOB_QUEUE = 'jobs';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Head('health')
  @ApiOperation({ summary: 'Health check endpoint', description: 'Check if the server is running' })
  @ApiResponse({ status: 200, description: 'Server is healthy' })
  healthCheck() {
    return this.appService.healthCheck();
  }

  @Public()
  @Post('enqueue')
  @ApiTags('queue')
  @ApiOperation({ summary: 'Enqueue a job', description: 'Add a new job to the queue' })
  @ApiBody({
    description: 'Job details',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Job name', example: 'test' },
        payload: { type: 'object', description: 'Job payload', example: { now: 1234567890 } }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Job enqueued successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Job ID' },
        name: { type: 'string', description: 'Job name' }
      }
    }
  })
  async enqueue(@Body() body: any) {
    const queue = new Queue(JOB_QUEUE);
    const jobName = body?.name || 'test';
    const payload = body?.payload || { now: Date.now() };
    const job = await queue.add(jobName, payload);
    return { id: job.id, name: job.name };
  }
}
