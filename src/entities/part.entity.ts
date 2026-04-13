import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  level: number;

  @Column({ name: 'power_boost', type: 'int', nullable: false })
  powerBoost: number;

  @Column({ name: 'price_silver', type: 'int', nullable: false })
  priceSilver: number;

  @Column({ name: 'image_url', type: 'text', nullable: false })
  imageUrl: string;
}
