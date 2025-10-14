import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StableCoin } from '../entities/stablecoin.entity';

@Injectable()
export class StableCoinRepository {
  constructor(
    @InjectRepository(StableCoin)
    private readonly repository: Repository<StableCoin>,
  ) {}

  async saveOrUpdate(data: Partial<StableCoin>): Promise<StableCoin> {
    const existing = await this.repository.findOne({
      where: { symbol: data.symbol },
    });

    if (existing) {
      Object.assign(existing, data);
      return await this.repository.save(existing);
    }

    const created = this.repository.create(data);
    return await this.repository.save(created);
  }

  async saveMany(items: Partial<StableCoin>[]): Promise<StableCoin[]> {
    const results: StableCoin[] = [];
    for (const item of items) {
      results.push(await this.saveOrUpdate(item));
    }
    return results;
  }

  async findById(idx: number): Promise<StableCoin | null> {
    return await this.repository.findOne({ where: { idx } });
  }

  async findAll(): Promise<StableCoin[]> {
    return await this.repository.find({ order: { price: 'DESC' } });
  }

  async deleteById(idx: number): Promise<boolean> {
    const result = await this.repository.delete({ idx });
    return result.affected > 0;
  }
}
