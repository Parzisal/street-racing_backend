import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Part } from 'src/entities/part.entity';

@Injectable()
export class PartRepository extends Repository<Part> {
  constructor(private dataSource: DataSource) {
    super(Part, dataSource.createEntityManager());
  }
}
