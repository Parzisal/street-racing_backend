// src/cars/cars.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car } from 'src/entities/car.entity';
import { Part } from 'src/entities/part.entity';
import { SeedService } from 'src/seed/seed.service';
import { CarRepository } from 'src/repositories/car.repository';
import { PartRepository } from 'src/repositories/part.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Part])],
  controllers: [CarsController],
  providers: [CarRepository, PartRepository, CarsService, SeedService],
  exports: [CarsService, CarRepository],
})
export class CarsModule {
  constructor(private seedService: SeedService) {
    this.seedService.seed().catch(console.error);
  }
}