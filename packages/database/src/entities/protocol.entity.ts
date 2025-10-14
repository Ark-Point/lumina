import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('protocols')
export class Protocol {
  @PrimaryGeneratedColumn()
  idx?: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  protocolId: string; // 원본 인터페이스의 id 필드

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  symbol: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'text', array: true })
  chains: string[];

  @Column({
    type: 'numeric',
    nullable: true,
  })
  tvl: number;

  @Column({ type: 'jsonb' })
  chainTvls: { [propertyName: string]: number };

  @Column({ type: 'decimal', precision: 10, nullable: true })
  change_1d: number;

  @Column({ type: 'decimal', precision: 10, nullable: true })
  change_7d: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
