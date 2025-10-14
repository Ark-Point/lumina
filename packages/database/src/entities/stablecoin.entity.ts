import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stablecoins')
export class StableCoin {
  @PrimaryGeneratedColumn()
  idx?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  geckoId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  symbol: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pegType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  priceSource: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pegMechanism: string;

  @Column({ type: 'numeric', nullable: true })
  circulatingPeggedUSD: number;

  @Column({ type: 'numeric', nullable: true })
  circulatingPrevDayPeggedUSD: number;

  @Column({ type: 'numeric', nullable: true })
  circulatingPrevWeekPeggedUSD: number;

  @Column({ type: 'numeric', nullable: true })
  circulatingPrevMonthPeggedUSD: number;

  @Column({ type: 'jsonb', nullable: true })
  chainCirculating: {
    [propertyName: string]: {
      current?: { peggedUSD?: number };
      circulatingPrevDay?: { peggedUSD?: number };
      circulatingPrevWeek?: { peggedUSD?: number };
      circulatingPrevMonth?: { peggedUSD?: number };
    };
  };

  @Column({ type: 'text', array: true })
  chains: string[];

  @Column({ type: 'numeric', nullable: true })
  price: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
