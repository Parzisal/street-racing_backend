// src/cars/cars.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car } from '@entities/car.entity';
import { Part } from '@entities/part.entity';
import { SeedService } from '@seed/seed.service';
import { CarRepository } from '@repositories/car.repository';
import { PartRepository } from '@repositories/part.repository';

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
