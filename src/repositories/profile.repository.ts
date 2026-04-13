import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Profile } from 'src/entities/profile.entity';

@Injectable()
export class ProfileRepository extends Repository<Profile> {
  constructor(private dataSource: DataSource) {
    super(Profile, dataSource.createEntityManager());
  }
}
