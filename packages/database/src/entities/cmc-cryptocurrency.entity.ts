import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cmc_cryptocurrencies')
export class CMCCryptoCurrency {
  @PrimaryGeneratedColumn()
  idx?: number;

  // CoinMarketCap 고유 ID
  @Index({ unique: true })
  @Column({ type: 'int', nullable: true })
  cmcId: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  symbol: string | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string | null;

  @Column({ type: 'int', nullable: true })
  numMarketPairs: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  dateAdded: Date | null;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[] | null;

  @Column({ type: 'numeric', nullable: true })
  maxSupply: number | null;

  @Column({ type: 'numeric', nullable: true })
  circulatingSupply: number | null;

  @Column({ type: 'numeric', nullable: true })
  totalSupply: number | null;

  @Column({ type: 'boolean', nullable: true })
  infiniteSupply: boolean | null;

  @Column({ type: 'jsonb', nullable: true })
  platform: Record<string, unknown> | null;

  @Column({ type: 'int', nullable: true })
  cmcRank: number | null;

  @Column({ type: 'numeric', nullable: true })
  selfReportedCirculatingSupply: number | null;

  @Column({ type: 'numeric', nullable: true })
  selfReportedMarketCap: number | null;

  @Column({ type: 'numeric', nullable: true })
  tvlRatio: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastUpdated: Date | null;

  // 통화별 시세 정보 원본 저장 (예: { USD: { price, volume_24h, ... }, KRW: { ... } })
  @Column({ type: 'jsonb', nullable: true })
  quote: Record<string, Record<string, unknown>> | null;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
