import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Protocol } from '../entities/protocol.entity';

@Injectable()
export class ProtocolRepository {
  constructor(
    @InjectRepository(Protocol)
    private readonly protocolRepository: Repository<Protocol>,
  ) {}

  /**
   * Protocol 데이터를 저장하거나 업데이트합니다.
   * protocolId를 기준으로 중복 체크를 수행합니다.
   */
  async saveOrUpdate(protocolData: Partial<Protocol>): Promise<Protocol> {
    const existingProtocol = await this.protocolRepository.findOne({
      where: { protocolId: protocolData.protocolId },
    });

    if (existingProtocol) {
      // 기존 데이터 업데이트
      Object.assign(existingProtocol, protocolData);
      return await this.protocolRepository.save(existingProtocol);
    } else {
      // 새 데이터 생성
      const newProtocol = this.protocolRepository.create(protocolData);
      return await this.protocolRepository.save(newProtocol);
    }
  }

  /**
   * 여러 Protocol 데이터를 일괄 저장합니다.
   */
  async saveMany(protocolsData: Partial<Protocol>[]): Promise<Protocol[]> {
    const results: Protocol[] = [];
    
    for (const protocolData of protocolsData) {
      const result = await this.saveOrUpdate(protocolData);
      results.push(result);
    }
    
    return results;
  }

  /**
   * protocolId로 Protocol을 조회합니다.
   */
  async findByProtocolId(protocolId: string): Promise<Protocol | null> {
    return await this.protocolRepository.findOne({
      where: { protocolId },
    });
  }

  /**
   * 모든 Protocol을 조회합니다.
   */
  async findAll(): Promise<Protocol[]> {
    return await this.protocolRepository.find({
      order: { tvl: 'DESC' },
    });
  }

  /**
   * TVL 기준으로 상위 N개 Protocol을 조회합니다.
   */
  async findTopByTvl(limit: number = 10): Promise<Protocol[]> {
    return await this.protocolRepository.find({
      order: { tvl: 'DESC' },
      take: limit,
    });
  }

  /**
   * 카테고리별 Protocol을 조회합니다.
   */
  async findByCategory(category: string): Promise<Protocol[]> {
    return await this.protocolRepository.find({
      where: { category },
      order: { tvl: 'DESC' },
    });
  }

  /**
   * 특정 체인에 있는 Protocol들을 조회합니다.
   */
  async findByChain(chain: string): Promise<Protocol[]> {
    return await this.protocolRepository
      .createQueryBuilder('protocol')
      .where('protocol.chains @> :chain', { chain: `["${chain}"]` })
      .orderBy('protocol.tvl', 'DESC')
      .getMany();
  }

  /**
   * TVL 범위로 Protocol을 조회합니다.
   */
  async findByTvlRange(minTvl: number, maxTvl: number): Promise<Protocol[]> {
    return await this.protocolRepository.find({
      where: {
        tvl: {
          $gte: minTvl,
          $lte: maxTvl,
        } as any,
      },
      order: { tvl: 'DESC' },
    });
  }

  /**
   * 특정 Protocol을 삭제합니다.
   */
  async deleteByProtocolId(protocolId: string): Promise<boolean> {
    const result = await this.protocolRepository.delete({ protocolId });
    return result.affected > 0;
  }

  /**
   * 카테고리별 Protocol 개수를 조회합니다.
   */
  async getCountByCategory(): Promise<{ category: string; count: number }[]> {
    return await this.protocolRepository
      .createQueryBuilder('protocol')
      .select('protocol.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('protocol.category')
      .getRawMany();
  }
}
