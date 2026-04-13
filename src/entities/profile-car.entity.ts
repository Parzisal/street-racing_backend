import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Car } from './car.entity';

@Entity('profiles_cars')
export class ProfileCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'profile_id', type: 'uuid', nullable: false })
  profileId: string;

  @Column({ name: 'car_id', type: 'uuid', nullable: false })
  carId: string;

  @ManyToOne(() => Profile, (profile) => profile.profileCars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => Car, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: Car;
}
