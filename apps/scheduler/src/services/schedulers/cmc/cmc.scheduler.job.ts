import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CMCService } from 'src/services/cmc/cmc.service';

@Injectable()
export class CMCApiSchedulerJob {
  private readonly logger = new Logger(CMCApiSchedulerJob.name);

  constructor(private readonly cmcService: CMCService) {}

  // 매 5분 (환경변수로 제어 가능)
  @Cron(process.env.CRON_CMC ?? '*/5 * * * *', { timeZone: process.env.TZ ?? 'Asia/Seoul' })
  async handle() {
    try {
      this.logger.log('Starting Coin Market Cap API data collection and storage...');

      // CMC Cryptocurrencies 정보 획득해 DB 저장
      await this.cmcService.getCryptocurrenciesCMC();
    } catch (e: any) {
      this.logger.error('Error in Coin Market Cap API scheduler:', e?.message ?? e);
    }
  }
}
