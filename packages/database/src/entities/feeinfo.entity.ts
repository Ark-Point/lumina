import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chain } from './chain.entity';
import { FeeProtocol } from './feeprotocol.entity';

@Entity('feeinfos')
export class FeeInfo {
  @PrimaryGeneratedColumn()
  idx?: number;

  @Column({ type: 'text', array: true, nullable: true })
  allChains: string[];

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
  change_1d: number;

  @Column({ type: 'numeric', nullable: true })
  change_7d: number;

  @Column({ type: 'numeric', nullable: true })
  change_1m: number;

  @Column({ type: 'numeric', nullable: true })
  change_7dover7d: number;

  @Column({ type: 'numeric', nullable: true })
  change_30dover30d: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total7DaysAgo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total30DaysAgo: string;

  // Breakdown 데이터 (JSON 형태로 저장)
  @Column({ type: 'jsonb', nullable: true })
  breakdown24h: any;

  @Column({ type: 'jsonb', nullable: true })
  breakdown30d: any;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relation
  @OneToOne(() => Chain)
  @JoinColumn()
  chain: Chain;

  @OneToMany(() => FeeProtocol, (protocols) => protocols.feeInfo, { nullable: true })
  protocols?: FeeProtocol[];
}
