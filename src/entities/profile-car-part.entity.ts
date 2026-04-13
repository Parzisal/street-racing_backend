import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProfileCar } from './profile-car.entity';
import { Part } from './part.entity';

@Entity('profiles_cars_parts')
export class ProfileCarPart {
  @PrimaryColumn('uuid', { name: 'profile_car_id' })
  profileCarId: string;

  @PrimaryColumn('uuid', { name: 'part_id' })
  partId: string;

  @ManyToOne(() => ProfileCar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_car_id' })
  profileCar: ProfileCar;

  @ManyToOne(() => Part, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'part_id' })
  part: Part;
}
