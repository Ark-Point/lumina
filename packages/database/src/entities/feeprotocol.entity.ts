import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FeeInfo } from './feeinfo.entity';

@Entity('feeprotocols')
export class FeeProtocol {
  @PrimaryGeneratedColumn()
  idx?: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  defillamaId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  module: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @Column({ type: 'text', array: true, nullable: true })
  chains: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  protocolType: string;

  @Column({ type: 'text', nullable: true })
  methodologyURL: string;

  @Column({ type: 'jsonb', nullable: true })
  methodology: {
    UserFees?: string;
    Fees?: string;
    Revenue?: string;
    ProtocolRevenue?: string;
    HoldersRevenue?: string;
    SupplySideRevenue?: string;
  };

  @Column({ type: 'varchar', length: 255, nullable: true })
  parentProtocol: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  @Column({ type: 'text', array: true, nullable: true })
  linkedProtocols: string[];

  @Column({ type: 'varchar', length: 255, unique: true })
  id: string;

  // Volume 데이터
  @Column({ type: 'varchar', length: 255, nullable: true })
  total24h: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total48hto24h: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total7d: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total14dto7d: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total60dto30d: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total30d: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total1y: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  totalAllTime: string;

  // Change 데이터
  @Column({ type: 'numeric', nullable: true })
  average1y: number;

  @Column({ type: 'numeric', nullable: true })
  monthlyAverage1y: number;

  @Column({ type: 'numeric', nullable: true })
  change_1d: number;

  @Column({ type: 'numeric', nullable: true })
  change_7d: number;

  @Column({ type: 'numeric', nullable: true })
  change_1m: number;

  @Column({ type: 'numeric', nullable: true })
  change_7dover7d: number;

  @Column({ type: 'numeric', nullable: true })
  change_30dover30d: number;

  @Column({ type: 'numeric', nullable: true })
  total7DaysAgo: number;

  @Column({ type: 'numeric', nullable: true })
  total30DaysAgo: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relation
  @ManyToOne(() => FeeInfo, (feeInfo) => feeInfo.protocols)
  @JoinColumn({ name: 'fee_info_idx', referencedColumnName: 'idx' })
  feeInfo: FeeInfo;
}
