import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Part } from '@entities/part.entity';
import { PartRepository } from '@repositories/part.repository';
import { PartsController } from './parts.controller';
import { PartsService } from './parts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Part])],
  controllers: [PartsController],
  providers: [PartRepository, PartsService],
  exports: [PartsService, PartRepository],
})
export class PartsModule {}
