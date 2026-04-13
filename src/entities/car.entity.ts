// src/cars/car.entity.ts
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn 
} from 'typeorm';

@Entity('cars') // указываем имя таблицы в БД
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  model: string;

  @Column({ name: 'base_power', type: 'int', nullable: false })
  basePower: number;

  @Column({ name: 'base_rating', type: 'int', nullable: false })
  baseRating: number;

  @Column({ name: 'buy_level', type: 'int', nullable: false })
  buyLevel: number;

  @Column({ name: 'price_silver', type: 'int', nullable: false })
  priceSilver: number;

  @Column({ name: 'price_gold', type: 'int', nullable: false })
  priceGold: number;

  @Column({ name: 'image_url', type: 'text', nullable: false })
  imageUrl: string;
}