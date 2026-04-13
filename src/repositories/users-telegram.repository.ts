import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersTelegram } from 'src/entities/users-telegram.entity';

@Injectable()
export class UsersTelegramRepository extends Repository<UsersTelegram> {
  constructor(private dataSource: DataSource) {
    super(UsersTelegram, dataSource.createEntityManager());
  }
}
