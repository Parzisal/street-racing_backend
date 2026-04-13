import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileCarPart } from '@entities/profile-car-part.entity';
import { ProfileCar } from '@entities/profile-car.entity';
import { Part } from '@entities/part.entity';
import { ProfileCarPartRepository } from '@repositories/profile-car-part.repository';
import { ProfileCarRepository } from '@repositories/profile-car.repository';
import { PartRepository } from '@repositories/part.repository';
import { ProfileCarPartsController } from './profile-car-parts.controller';
import { ProfileCarPartsService } from './profile-car-parts.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileCarPart, ProfileCar, Part])],
  controllers: [ProfileCarPartsController],
  providers: [
    ProfileCarPartRepository,
    ProfileCarRepository,
    PartRepository,
    ProfileCarPartsService,
  ],
  exports: [ProfileCarPartsService, ProfileCarPartRepository],
})
export class ProfileCarPartsModule {}
