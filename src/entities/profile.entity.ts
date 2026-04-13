import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileCar } from './profile-car.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  level: number;

  @Column({ type: 'int', nullable: false })
  experience: number;

  @Column({ type: 'int', nullable: false })
  silver: number;

  @Column({ type: 'int', nullable: false })
  gold: number;

  @Column({ name: 'garage_slots', type: 'int', nullable: false })
  garageSlots: number;

  @Column({ name: 'selected_car_id', type: 'uuid', nullable: true })
  selectedCarId: string | null;

  @ManyToOne(() => ProfileCar, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'selected_car_id' })
  selectedCar: ProfileCar | null;

  @OneToMany(() => ProfileCar, (pc) => pc.profile)
  profileCars: ProfileCar[];
}
