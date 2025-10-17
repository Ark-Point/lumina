import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DexInfo } from './dexinfo.entity';
import { FeeInfo } from './feeinfo.entity';
import { PerpInfo } from './perpinfo.entity';

@Entity('chains')
export class Chain {
  @PrimaryGeneratedColumn()
  idx?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  geckoId: string;

  @Column({
    type: 'numeric',
  })
  tvl: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tokenSymbol: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cmcId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  chainId: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Relation
  @OneToOne(() => DexInfo, { nullable: true })
  dexInfo?: DexInfo;

  @OneToOne(() => FeeInfo, { nullable: true })
  feeInfo?: FeeInfo;

  @OneToOne(() => PerpInfo, { nullable: true })
  perpInfo?: PerpInfo;
}
