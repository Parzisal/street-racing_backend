import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Settings } from 'src/entities/settings.entity';

@Injectable()
export class SettingsRepository extends Repository<Settings> {
  constructor(private dataSource: DataSource) {
    super(Settings, dataSource.createEntityManager());
  }
}
