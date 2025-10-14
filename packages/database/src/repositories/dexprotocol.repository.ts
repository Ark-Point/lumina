import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DexProtocol } from '../entities/dexprotocol.entity';

@Injectable()
export class DexProtocolRepository {
  constructor(
    @InjectRepository(DexProtocol)
    private readonly repository: Repository<DexProtocol>,
  ) {}

  /**
   * DexProtocol 데이터를 저장하거나 업데이트합니다.
   * defillamaId를 기준으로 중복 체크를 수행합니다.
   */
  async saveOrUpdate(
    data: Partial<DexProtocol>,
    entityManager?: EntityManager,
  ): Promise<DexProtocol> {
    const repository = !!entityManager ? entityManager.getRepository(DexProtocol) : this.repository;

    const existing = await repository.findOne({
      where: { defillamaId: data.defillamaId },
    });

    if (existing) {
      Object.assign(existing, data);
      return await repository.save(existing);
    }

    const created = repository.create(data);
    return await repository.save(created);
  }

  /**
   * 여러 DexProtocol 데이터를 일괄 저장합니다.
   */
  async saveMany(
    items: Partial<DexProtocol>[],
    entityManager?: EntityManager,
  ): Promise<DexProtocol[]> {
    const results: DexProtocol[] = [];
    for (const item of items) {
      results.push(await this.saveOrUpdate(item, entityManager));
    }
    return results;
  }

  /**
   * idx로 DexProtocol을 조회합니다.
   */
  async findById(idx: number): Promise<DexProtocol | null> {
    return await this.repository.findOne({ where: { idx } });
  }

  /**
   * defillamaId로 DexProtocol을 조회합니다.
   */
  async findByDefillamaId(defillamaId: string): Promise<DexProtocol | null> {
    return await this.repository.findOne({ where: { defillamaId } });
  }

  /**
   * id로 DexProtocol을 조회합니다.
   */
  async findByProtocolId(id: string): Promise<DexProtocol | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * 모든 DexProtocol을 조회합니다.
   */
  async findAll(): Promise<DexProtocol[]> {
    return await this.repository.find({ order: { total24h: 'DESC' } });
  }

  /**
   * 특정 체인의 DexProtocol들을 조회합니다.
   */
  async findByChain(chain: string): Promise<DexProtocol[]> {
    return await this.repository
      .createQueryBuilder('dexprotocol')
      .where('dexprotocol.chains @> :chain', { chain: `["${chain}"]` })
      .orderBy('dexprotocol.total24h', 'DESC')
      .getMany();
  }

  /**
   * 특정 카테고리의 DexProtocol들을 조회합니다.
   */
  async findByCategory(category: string): Promise<DexProtocol[]> {
    return await this.repository.find({
      where: { category },
      order: { total24h: 'DESC' },
    });
  }

  /**
   * 특정 프로토콜 타입의 DexProtocol들을 조회합니다.
   */
  async findByProtocolType(protocolType: string): Promise<DexProtocol[]> {
    return await this.repository.find({
      where: { protocolType },
      order: { total24h: 'DESC' },
    });
  }

  /**
   * 24시간 거래량 기준으로 상위 N개 DexProtocol을 조회합니다.
   */
  async findTopByVolume24h(limit: number = 10): Promise<DexProtocol[]> {
    return await this.repository.find({
      order: { total24h: 'DESC' },
      take: limit,
    });
  }

  /**
   * 7일 거래량 기준으로 상위 N개 DexProtocol을 조회합니다.
   */
  async findTopByVolume7d(limit: number = 10): Promise<DexProtocol[]> {
    return await this.repository.find({
      order: { total7d: 'DESC' },
      take: limit,
    });
  }

  /**
   * 특정 DexProtocol을 삭제합니다.
   */
  async deleteById(idx: number): Promise<boolean> {
    const result = await this.repository.delete({ idx });
    return result.affected > 0;
  }

  /**
   * defillamaId로 DexProtocol을 삭제합니다.
   */
  async deleteByDefillamaId(defillamaId: string): Promise<boolean> {
    const result = await this.repository.delete({ defillamaId });
    return result.affected > 0;
  }

  /**
   * 카테고리별 DexProtocol 개수를 조회합니다.
   */
  async getCountByCategory(): Promise<{ category: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('dexprotocol')
      .select('dexprotocol.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('dexprotocol.category')
      .getRawMany();
  }

  /**
   * 프로토콜 타입별 DexProtocol 개수를 조회합니다.
   */
  async getCountByProtocolType(): Promise<{ protocolType: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('dexprotocol')
      .select('dexprotocol.protocolType', 'protocolType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('dexprotocol.protocolType')
      .getRawMany();
  }

  /**
   * 체인별 DexProtocol 개수를 조회합니다.
   */
  async getCountByChain(): Promise<{ chain: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('dexprotocol')
      .select('dexprotocol.chains', 'chain')
      .addSelect('COUNT(*)', 'count')
      .groupBy('dexprotocol.chains')
      .getRawMany();
  }
}
