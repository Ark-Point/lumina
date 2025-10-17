import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CMCCryptoCurrency } from '../entities/cmc-cryptocurrency.entity';

@Injectable()
export class CMCCryptoCurrencyRepository {
  constructor(
    @InjectRepository(CMCCryptoCurrency)
    private readonly repository: Repository<CMCCryptoCurrency>,
  ) {}

  async saveOrUpdate(data: Partial<CMCCryptoCurrency>): Promise<CMCCryptoCurrency> {
    // 우선순위 키: cmcId -> symbol+slug
    const where = data.cmcId
      ? { cmcId: data.cmcId }
      : data.symbol && data.slug
      ? ({ symbol: data.symbol, slug: data.slug } as any)
      : null;

    let existing: CMCCryptoCurrency | null = null;
    if (where) {
      existing = await this.repository.findOne({ where });
    }

    if (existing) {
      Object.assign(existing, data);
      return await this.repository.save(existing);
    }

    const created = this.repository.create(data);
    return await this.repository.save(created);
  }

  async saveMany(items: Partial<CMCCryptoCurrency>[]): Promise<CMCCryptoCurrency[]> {
    const results: CMCCryptoCurrency[] = [];
    for (const item of items) {
      results.push(await this.saveOrUpdate(item));
    }
    return results;
  }

  async findByCmcId(cmcId: number): Promise<CMCCryptoCurrency | null> {
    return await this.repository.findOne({ where: { cmcId } });
  }

  async findBySymbol(symbol: string): Promise<CMCCryptoCurrency[]> {
    return await this.repository.find({ where: { symbol }, order: { cmcRank: 'ASC' } });
  }

  async findTopByMarketRank(limit = 50): Promise<CMCCryptoCurrency[]> {
    return await this.repository.find({ order: { cmcRank: 'ASC' }, take: limit });
  }

  async deleteByCmcId(cmcId: number): Promise<boolean> {
    const result = await this.repository.delete({ cmcId });
    return result.affected ? result.affected > 0 : false;
  }
}


