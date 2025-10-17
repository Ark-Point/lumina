import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiDefiLlamaService } from '../../defiLlama/api.defillama.service';

@Injectable()
export class DefiLlamaApiSchedulerJob {
  private readonly logger = new Logger(DefiLlamaApiSchedulerJob.name);

  constructor(private readonly defiLlamaService: ApiDefiLlamaService) {}

  // 매 5분 (환경변수로 제어 가능)
  @Cron(process.env.CRON_TVL ?? '*/5 * * * *', { timeZone: process.env.TZ ?? 'Asia/Seoul' })
  async handle() {
    try {
      this.logger.log('Starting DefiLlama data collection and storage...');

      // DefiLlamaAPI 정보 획득해 DB 저장
      const baseProtocols = await this.defiLlamaService.queryDefiLlamaApiForBaseMainnet();
    } catch (e: any) {
      this.logger.error('Error in DefiLlamaApi scheduler:', e?.message ?? e);
    }
  }
}
