import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YieldPool } from '../entities/yieldpool.entity';

@Injectable()
export class YieldPoolRepository {
  constructor(
    @InjectRepository(YieldPool)
    private readonly repository: Repository<YieldPool>,
  ) {}

  /**
   * YieldPool 데이터를 저장하거나 업데이트합니다.
   * pool 주소를 기준으로 중복 체크를 수행합니다.
   */
  async saveOrUpdate(data: Partial<YieldPool>): Promise<YieldPool> {
    const existing = await this.repository.findOne({
      where: { pool: data.pool },
    });

    if (existing) {
      Object.assign(existing, data);
      return await this.repository.save(existing);
    }

    const created = this.repository.create(data);
    return await this.repository.save(created);
  }

  /**
   * 여러 YieldPool 데이터를 일괄 저장합니다.
   */
  async saveMany(items: Partial<YieldPool>[]): Promise<YieldPool[]> {
    const results: YieldPool[] = [];
    for (const item of items) {
      results.push(await this.saveOrUpdate(item));
    }
    return results;
  }

  /**
   * idx로 YieldPool을 조회합니다.
   */
  async findById(idx: number): Promise<YieldPool | null> {
    return await this.repository.findOne({ where: { idx } });
  }

  /**
   * pool 주소로 YieldPool을 조회합니다.
   */
  async findByPool(pool: string): Promise<YieldPool | null> {
    return await this.repository.findOne({ where: { pool } });
  }

  /**
   * 모든 YieldPool을 조회합니다.
   */
  async findAll(): Promise<YieldPool[]> {
    return await this.repository.find({ order: { apy: 'DESC' } });
  }

  /**
   * 특정 체인의 YieldPool들을 조회합니다.
   */
  async findByChain(chain: string): Promise<YieldPool[]> {
    return await this.repository.find({
      where: { chain },
      order: { apy: 'DESC' },
    });
  }

  /**
   * 특정 프로젝트의 YieldPool들을 조회합니다.
   */
  async findByProject(project: string): Promise<YieldPool[]> {
    return await this.repository.find({
      where: { project },
      order: { apy: 'DESC' },
    });
  }

  /**
   * APY 기준으로 상위 N개 YieldPool을 조회합니다.
   */
  async findTopByApy(limit: number = 10): Promise<YieldPool[]> {
    return await this.repository.find({
      order: { apy: 'DESC' },
      take: limit,
    });
  }

  /**
   * TVL 기준으로 상위 N개 YieldPool을 조회합니다.
   */
  async findTopByTvl(limit: number = 10): Promise<YieldPool[]> {
    return await this.repository.find({
      order: { tvlUsd: 'DESC' },
      take: limit,
    });
  }

  /**
   * APY 범위로 YieldPool을 조회합니다.
   */
  async findByApyRange(minApy: number, maxApy: number): Promise<YieldPool[]> {
    return await this.repository.find({
      where: {
        apy: {
          $gte: minApy,
          $lte: maxApy,
        } as any,
      },
      order: { apy: 'DESC' },
    });
  }

  /**
   * 특정 YieldPool을 삭제합니다.
   */
  async deleteById(idx: number): Promise<boolean> {
    const result = await this.repository.delete({ idx });
    return result.affected > 0;
  }

  /**
   * 특정 pool 주소의 YieldPool을 삭제합니다.
   */
  async deleteByPool(pool: string): Promise<boolean> {
    const result = await this.repository.delete({ pool });
    return result.affected > 0;
  }

  /**
   * 체인별 YieldPool 개수를 조회합니다.
   */
  async getCountByChain(): Promise<{ chain: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('yieldpool')
      .select('yieldpool.chain', 'chain')
      .addSelect('COUNT(*)', 'count')
      .groupBy('yieldpool.chain')
      .getRawMany();
  }

  /**
   * 프로젝트별 YieldPool 개수를 조회합니다.
   */
  async getCountByProject(): Promise<{ project: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('yieldpool')
      .select('yieldpool.project', 'project')
      .addSelect('COUNT(*)', 'count')
      .groupBy('yieldpool.project')
      .getRawMany();
  }
}
