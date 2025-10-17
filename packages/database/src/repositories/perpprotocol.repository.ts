import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PerpProtocol } from '../entities/perpprotocol.entity';

@Injectable()
export class PerpProtocolRepository {
  constructor(
    @InjectRepository(PerpProtocol)
    private readonly repository: Repository<PerpProtocol>,
  ) {}

  /**
   * PerpProtocol 데이터를 저장하거나 업데이트합니다.
   * defillamaId를 기준으로 중복 체크를 수행합니다.
   */
  async saveOrUpdate(
    data: Partial<PerpProtocol>,
    entityManager?: EntityManager,
  ): Promise<PerpProtocol> {
    const repository = !!entityManager
      ? entityManager.getRepository(PerpProtocol)
      : this.repository;

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
   * 여러 PerpProtocol 데이터를 일괄 저장합니다.
   */
  async saveMany(
    items: Partial<PerpProtocol>[],
    entityManager?: EntityManager,
  ): Promise<PerpProtocol[]> {
    const results: PerpProtocol[] = [];
    for (const item of items) {
      results.push(await this.saveOrUpdate(item, entityManager));
    }
    return results;
  }

  /**
   * idx로 PerpProtocol을 조회합니다.
   */
  async findById(idx: number): Promise<PerpProtocol | null> {
    return await this.repository.findOne({ where: { idx } });
  }

  /**
   * defillamaId로 PerpProtocol을 조회합니다.
   */
  async findByDefillamaId(defillamaId: string): Promise<PerpProtocol | null> {
    return await this.repository.findOne({ where: { defillamaId } });
  }

  /**
   * id로 PerpProtocol을 조회합니다.
   */
  async findByProtocolId(id: string): Promise<PerpProtocol | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * 모든 PerpProtocol을 조회합니다.
   */
  async findAll(): Promise<PerpProtocol[]> {
    return await this.repository.find({ order: { total24h: 'DESC' } });
  }

  /**
   * 특정 체인의 PerpProtocol들을 조회합니다.
   */
  async findByChain(chain: string): Promise<PerpProtocol[]> {
    return await this.repository
      .createQueryBuilder('perpProtocol')
      .where('perpProtocol.chains @> :chain', { chain: `["${chain}"]` })
      .orderBy('perpProtocol.total24h', 'DESC')
      .getMany();
  }

  /**
   * 특정 카테고리의 PerpProtocol들을 조회합니다.
   */
  async findByCategory(category: string): Promise<PerpProtocol[]> {
    return await this.repository.find({
      where: { category },
      order: { total24h: 'DESC' },
    });
  }

  /**
   * 특정 프로토콜 타입의 PerpProtocol들을 조회합니다.
   */
  async findByProtocolType(protocolType: string): Promise<PerpProtocol[]> {
    return await this.repository.find({
      where: { protocolType },
      order: { total24h: 'DESC' },
    });
  }

  /**
   * 24시간 거래량 기준으로 상위 N개 PerpProtocol을 조회합니다.
   */
  async findTopByVolume24h(limit: number = 10): Promise<PerpProtocol[]> {
    return await this.repository.find({
      order: { total24h: 'DESC' },
      take: limit,
    });
  }

  /**
   * 7일 거래량 기준으로 상위 N개 PerpProtocol을 조회합니다.
   */
  async findTopByVolume7d(limit: number = 10): Promise<PerpProtocol[]> {
    return await this.repository.find({
      order: { total7d: 'DESC' },
      take: limit,
    });
  }

  /**
   * 특정 PerpProtocol을 삭제합니다.
   */
  async deleteById(idx: number): Promise<boolean> {
    const result = await this.repository.delete({ idx });
    return result.affected > 0;
  }

  /**
   * defillamaId로 PerpProtocol을 삭제합니다.
   */
  async deleteByDefillamaId(defillamaId: string): Promise<boolean> {
    const result = await this.repository.delete({ defillamaId });
    return result.affected > 0;
  }

  /**
   * 카테고리별 PerpProtocol 개수를 조회합니다.
   */
  async getCountByCategory(): Promise<{ category: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('perpProtocol')
      .select('perpProtocol.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('perpProtocol.category')
      .getRawMany();
  }

  /**
   * 프로토콜 타입별 PerpProtocol 개수를 조회합니다.
   */
  async getCountByProtocolType(): Promise<{ protocolType: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('perpProtocol')
      .select('perpProtocol.protocolType', 'protocolType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('perpProtocol.protocolType')
      .getRawMany();
  }

  /**
   * 체인별 PerpProtocol 개수를 조회합니다.
   */
  async getCountByChain(): Promise<{ chain: string; count: number }[]> {
    return await this.repository
      .createQueryBuilder('perpProtocol')
      .select('perpProtocol.chains', 'chain')
      .addSelect('COUNT(*)', 'count')
      .groupBy('perpProtocol.chains')
      .getRawMany();
  }
}
