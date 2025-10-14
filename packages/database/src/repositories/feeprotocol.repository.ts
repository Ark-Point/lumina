import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { FeeProtocol } from '../entities/feeprotocol.entity';

@Injectable()
export class FeeProtocolRepository {
  constructor(
    @InjectRepository(FeeProtocol)
    private readonly repository: Repository<FeeProtocol>,
  ) {}

  /**
   * FeeProtocol 데이터를 저장하거나 업데이트합니다.
   * defillamaId를 기준으로 중복 체크를 수행합니다.
   */
  async saveOrUpdate(
    data: Partial<FeeProtocol>,
    entityManager?: EntityManager,
  ): Promise<FeeProtocol> {
    const repository = !!entityManager ? entityManager.getRepository(FeeProtocol) : this.repository;

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
   * 여러 FeeProtocol 데이터를 일괄 저장합니다.
   */
  async saveMany(
    items: Partial<FeeProtocol>[],
    entityManager?: EntityManager,
  ): Promise<FeeProtocol[]> {
    const results: FeeProtocol[] = [];
    for (const item of items) {
      results.push(await this.saveOrUpdate(item, entityManager));
    }
    return results;
  }

  /**
   * idx로 FeeProtocol을 조회합니다.
   */
  async findById(idx: number): Promise<FeeProtocol | null> {
    return await this.repository.findOne({ where: { idx } });
  }

  /**
   * defillamaId로 FeeProtocol을 조회합니다.
   */
  async findByDefillamaId(defillamaId: string): Promise<FeeProtocol | null> {
    return await this.repository.findOne({ where: { defillamaId } });
  }

  /**
   * id로 FeeProtocol을 조회합니다.
   */
  async findByProtocolId(id: string): Promise<FeeProtocol | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * 모든 FeeProtocol을 조회합니다.
   */
  async findAll(): Promise<FeeProtocol[]> {
    return await this.repository.find({ order: { total24h: 'DESC' } });
  }

  /**
   * 특정 체인의 FeeProtocol들을 조회합니다.
   */
  async findByChain(chain: string): Promise<FeeProtocol[]> {
    return await this.repository
      .createQueryBuilder('Feeprotocol')
      .where('Feeprotocol.chains @> :chain', { chain: `["${chain}"]` })
      .orderBy('Feeprotocol.total24h', 'DESC')
      .getMany();
  }

  /**
   * 특정 카테고리의 FeeProtocol들을 조회합니다.
   */
  async findByCategory(category: string): Promise<FeeProtocol[]> {
    return await this.repository.find({
      where: { category },
      order: { total24h: 'DESC' },
    });
  }

  /**
   * 특정 프로토콜 타입의 FeeProtocol들을 조회합니다.
   */
  async findByProtocolType(protocolType: string): Promise<FeeProtocol[]> {
    return await this.repository.find({
      where: { protocolType },
      order: { total24h: 'DESC' },
    });
  }

  /**
   * 24시간 거래량 기준으로 상위 N개 FeeProtocol을 조회합니다.
   */
  async findTopByVolume24h(limit: number = 10): Promise<FeeProtocol[]> {
    return await this.repository.find({
      order: { total24h: 'DESC' },
      take: limit,
    });
  }

  /**
   * 7일 거래량 기준으로 상위 N개 FeeProtocol을 조회합니다.
   */
  async findTopByVolume7d(limit: number = 10): Promise<FeeProtocol[]> {
    return await this.repository.find({
      order: { total7d: 'DESC' },
      take: limit,
    });
  }

  /**
   * 특정 FeeProtocol을 삭제합니다.
   */
  async deleteById(idx: number): Promise<boolean> {
    const result = await this.repository.delete({ idx });
    return result.affected > 0;
  }

  /**
   * defillamaId로 FeeProtocol을 삭제합니다.
   */
  async deleteByDefillamaId(defillamaId: string): Promise<boolean> {
    const result = await this.repository.delete({ defillamaId });
    return result.affected > 0;
  }

  /**
   * 카테고리별 FeeProtocol 개수를 조회합니다.
   */
  async getCountByCategory(): Promise<{ category: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('feeprotocol')
      .select('feeprotocol.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('feeprotocol.category')
      .getRawMany();
  }

  /**
   * 프로토콜 타입별 FeeProtocol 개수를 조회합니다.
   */
  async getCountByProtocolType(): Promise<{ protocolType: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('feeprotocol')
      .select('feeprotocol.protocolType', 'protocolType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('feeprotocol.protocolType')
      .getRawMany();
  }

  /**
   * 체인별 FeeProtocol 개수를 조회합니다.
   */
  async getCountByChain(): Promise<{ chain: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('feeprotocol')
      .select('feeprotocol.chains', 'chain')
      .addSelect('COUNT(*)', 'count')
      .groupBy('feeprotocol.chains')
      .getRawMany();
  }
}
