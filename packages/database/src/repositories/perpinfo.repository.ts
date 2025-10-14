import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Chain } from '../entities';
import { PerpInfo } from '../entities/perpinfo.entity';

@Injectable()
export class PerpInfoRepository {
  constructor(
    @InjectRepository(PerpInfo)
    private readonly repository: Repository<PerpInfo>,
  ) {}

  /**
   * PerpInfo 데이터를 저장하거나 업데이트합니다.
   * chain을 기준으로 중복 체크를 수행합니다.
   */
  async saveOrUpdate(data: Partial<PerpInfo>, entityManager?: EntityManager): Promise<PerpInfo> {
    const repository = !!entityManager ? entityManager.getRepository(PerpInfo) : this.repository;

    const existing = await repository.findOne({
      where: {
        chain: {
          idx: data?.chain?.idx,
        },
      },
    });

    if (existing) {
      Object.assign(existing, data);
      return await repository.save(existing);
    }

    const created = repository.create(data);
    return await repository.save(created);
  }

  /**
   * 여러 PerpInfo 데이터를 일괄 저장합니다.
   */
  async saveMany(items: Partial<PerpInfo>[]): Promise<PerpInfo[]> {
    const results: PerpInfo[] = [];
    for (const item of items) {
      results.push(await this.saveOrUpdate(item));
    }
    return results;
  }

  /**
   * idx로 PerpInfo 조회합니다.
   */
  async findById(idx: number): Promise<PerpInfo | null> {
    return await this.repository.findOne({ where: { idx } });
  }

  /**
   * chain으로 PerpInfo 조회합니다.
   */
  async findByChain(chain: Chain): Promise<PerpInfo | null> {
    return await this.repository.findOne({ where: { chain } });
  }

  /**
   * 모든 PerpInfo를 조회합니다.
   */
  async findAll(): Promise<PerpInfo[]> {
    return await this.repository.find({ order: { total24h: 'DESC' } });
  }

  /**
   * 24시간 거래량 기준으로 상위 N개 PerpInfo를 조회합니다.
   */
  async findTopByVolume24h(limit: number = 10): Promise<PerpInfo[]> {
    return await this.repository.find({
      order: { total24h: 'DESC' },
      take: limit,
    });
  }

  /**
   * 7일 거래량 기준으로 상위 N개 PerpInfo를 조회합니다.
   */
  async findTopByVolume7d(limit: number = 10): Promise<PerpInfo[]> {
    return await this.repository.find({
      order: { total7d: 'DESC' },
      take: limit,
    });
  }

  /**
   * 30일 거래량 기준으로 상위 N개 PerpInfo를 조회합니다.
   */
  async findTopByVolume30d(limit: number = 10): Promise<PerpInfo[]> {
    return await this.repository.find({
      order: { total30d: 'DESC' },
      take: limit,
    });
  }

  /**
   * 1일 변화율 기준으로 상위 N개 PerpInfo를 조회합니다.
   */
  async findTopByChange1d(limit: number = 10): Promise<PerpInfo[]> {
    return await this.repository.find({
      order: { change_1d: 'DESC' },
      take: limit,
    });
  }

  /**
   * 7일 변화율 기준으로 상위 N개 PerpInfo를 조회합니다.
   */
  async findTopByChange7d(limit: number = 10): Promise<PerpInfo[]> {
    return await this.repository.find({
      order: { change_7d: 'DESC' },
      take: limit,
    });
  }

  /**
   * 30일 변화율 기준으로 상위 N개 PerpInfo를 조회합니다.
   */
  async findTopByChange30d(limit: number = 10): Promise<PerpInfo[]> {
    return await this.repository.find({
      order: { change_1m: 'DESC' },
      take: limit,
    });
  }

  /**
   * 특정 PerpInfo를 삭제합니다.
   */
  async deleteById(idx: number): Promise<boolean> {
    const result = await this.repository.delete({ idx });
    return result.affected > 0;
  }

  /**
   * chain으로 PerpInfo를 삭제합니다.
   */
  async deleteByChain(chain: Chain): Promise<boolean> {
    const result = await this.repository.delete({ chain });
    return result.affected > 0;
  }

  /**
   * 체인별 PerpInfo 개수를 조회합니다.
   */
  async getCountByChain(): Promise<{ chain: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('perpinfo')
      .select('perpinfo.chain', 'chain')
      .addSelect('COUNT(*)', 'count')
      .groupBy('perpinfo.chain')
      .getRawMany();
  }

  /**
   * 24시간 거래량이 특정 값 이상인 FeeInfo들을 조회합니다.
   */
  async findByMinVolume24h(minVolume: string): Promise<PerpInfo[]> {
    return await this.repository
      .createQueryBuilder('perpinfo')
      .where('CAST(perpinfo.total24h AS DECIMAL) >= :minVolume', { minVolume })
      .orderBy('perpinfo.total24h', 'DESC')
      .getMany();
  }

  /**
   * 7일 거래량이 특정 값 이상인 FeeInfo들을 조회합니다.
   */
  async findByMinVolume7d(minVolume: string): Promise<PerpInfo[]> {
    return await this.repository
      .createQueryBuilder('perpinfo')
      .where('CAST(perpinfo.total7d AS DECIMAL) >= :minVolume', { minVolume })
      .orderBy('perpinfo.total7d', 'DESC')
      .getMany();
  }

  /**
   * 30일 거래량이 특정 값 이상인 FeeInfo들을 조회합니다.
   */
  async findByMinVolume30d(minVolume: string): Promise<PerpInfo[]> {
    return await this.repository
      .createQueryBuilder('perpinfo')
      .where('CAST(perpinfo.total30d AS DECIMAL) >= :minVolume', { minVolume })
      .orderBy('perpinfo.total30d', 'DESC')
      .getMany();
  }
}
