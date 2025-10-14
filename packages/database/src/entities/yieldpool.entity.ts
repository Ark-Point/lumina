import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('yieldpools')
export class YieldPool {
  @PrimaryGeneratedColumn()
  idx?: number;

  @Column({ type: 'varchar', length: 100 })
  chain: string;

  @Column({ type: 'varchar', length: 255 })
  project: string;

  @Column({ type: 'varchar', length: 255 })
  symbol: string;

  @Column({ type: 'numeric', nullable: true })
  tvlUsd: number;

  @Column({ type: 'numeric', nullable: true })
  apyBase: number;

  @Column({ type: 'numeric', nullable: true })
  apyReward: number;

  @Column({ type: 'numeric', nullable: true })
  apy: number;

  @Column({ type: 'text', array: true, nullable: true })
  rewardTokens: string[];

  @Column({ type: 'varchar', length: 255 })
  pool: string;

  @Column({ type: 'numeric', nullable: true })
  apyPct1D: number;

  @Column({ type: 'numeric', nullable: true })
  apyPct7D: number;

  @Column({ type: 'numeric', nullable: true })
  apyPct30D: number;

  @Column({ type: 'boolean', default: false })
  stablecoin: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ilRisk: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  exposure: string;

  @Column({ type: 'jsonb', nullable: true })
  predictions: {
    predictedClass?: string;
    predictedProbability?: number;
    binnedConfidence?: number;
  };

  @Column({ type: 'text', nullable: true })
  poolMeta: string;

  @Column({ type: 'numeric', nullable: true })
  mu: number;

  @Column({ type: 'numeric', nullable: true })
  sigma: number;

  @Column({ type: 'int', nullable: true })
  count: number;

  @Column({ type: 'boolean', default: false })
  outlier: boolean;

  @Column({ type: 'text', array: true, nullable: true })
  underlyingTokens: string[];

  @Column({ type: 'numeric', nullable: true })
  il7d: number;

  @Column({ type: 'numeric', nullable: true })
  apyBase7d: number;

  @Column({ type: 'numeric', nullable: true })
  apyMean30d: number;

  @Column({ type: 'numeric', nullable: true })
  volumeUsd1d: number;

  @Column({ type: 'numeric', nullable: true })
  volumeUsd7d: number;

  @Column({ type: 'numeric', nullable: true })
  apyBaseInception: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
