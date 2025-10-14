import { Injectable } from '@nestjs/common';
import { CommonResponseDto } from './common/dto/response/common-response.dto';
import { BaseService } from './base.service';

@Injectable()
export class AppService extends BaseService {
  healthCheck() {
    const statusCode = 200;
    this.logger.debug(`[${this.healthCheck.name}] ${statusCode}`);
    return (new CommonResponseDto().statusCode = statusCode);
  }
}
