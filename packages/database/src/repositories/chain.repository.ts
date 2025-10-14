import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chain } from '../entities/chain.entity';

@Injectable()
export class ChainRepository {
  constructor(
    @InjectRepository(Chain)
    private readonly chainRepository: Repository<Chain>,
  ) {}

  /**
   * Chain 데이터를 저장하거나 업데이트합니다.
   * chainId를 기준으로 중복 체크를 수행합니다.
   */
  async saveOrUpdate(chainData: Partial<Chain>): Promise<Chain> {
    const existingChain = await this.chainRepository.findOne({
      where: { name: chainData.name },
    });

    if (existingChain) {
      // 기존 데이터 업데이트
      Object.assign(existingChain, chainData);
      return await this.chainRepository.save(existingChain);
    } else {
      // 새 데이터 생성
      const newChain = this.chainRepository.create(chainData);
      return await this.chainRepository.save(newChain);
    }
  }

  /**
   * 여러 Chain 데이터를 일괄 저장합니다.
   */
  async saveMany(chainsData: Partial<Chain>[]): Promise<Chain[]> {
    const results: Chain[] = [];

    for (const chainData of chainsData) {
      const result = await this.saveOrUpdate(chainData);
      results.push(result);
    }

    return results;
  }

  /**
   * chainId로 Chain을 조회합니다.
   */
  async findByChainId(chainId: string): Promise<Chain | null> {
    return await this.chainRepository.findOne({
      where: { chainId },
    });
  }

  /**
   * Name 으로 Chain을 조회합니다.
   */
  async findByName(name: string): Promise<Chain | null> {
    return await this.chainRepository.findOne({
      where: { name },
    });
  }

  /**
   * 모든 Chain을 조회합니다.
   */
  async findAll(): Promise<Chain[]> {
    return await this.chainRepository.find({
      order: { tvl: 'DESC' },
    });
  }

  /**
   * TVL 기준으로 상위 N개 Chain을 조회합니다.
   */
  async findTopByTvl(limit: number = 10): Promise<Chain[]> {
    return await this.chainRepository.find({
      order: { tvl: 'DESC' },
      take: limit,
    });
  }

  /**
   * 특정 Chain을 삭제합니다.
   */
  async deleteByChainId(chainId: string): Promise<boolean> {
    const result = await this.chainRepository.delete({ chainId });
    return result.affected > 0;
  }
}
