import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Car } from './car.entity';

@Entity('settings')
export class Settings {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({ name: 'default_start_level', type: 'int', default: 1 })
  defaultStartLevel: number;

  @Column({ name: 'default_experience', type: 'int', default: 0 })
  defaultExperience: number;

  @Column({ name: 'default_silver', type: 'int', default: 5000 })
  defaultSilver: number;

  @Column({ name: 'default_gold', type: 'int', default: 10 })
  defaultGold: number;

  @Column({ name: 'default_garage_slots', type: 'int', default: 4 })
  defaultGarageSlots: number;

  @Column({ name: 'default_car_id', type: 'uuid', nullable: true })
  defaultCarId: string | null;

  @ManyToOne(() => Car, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'default_car_id' })
  defaultCar: Car | null;
}
