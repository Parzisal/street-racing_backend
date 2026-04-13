import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProfileCar } from '@entities/profile-car.entity';

@Injectable()
export class ProfileCarRepository extends Repository<ProfileCar> {
  constructor(private dataSource: DataSource) {
    super(ProfileCar, dataSource.createEntityManager());
  }
}
