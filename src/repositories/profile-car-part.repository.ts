import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProfileCarPart } from '@entities/profile-car-part.entity';

@Injectable()
export class ProfileCarPartRepository extends Repository<ProfileCarPart> {
  constructor(private dataSource: DataSource) {
    super(ProfileCarPart, dataSource.createEntityManager());
  }
}
