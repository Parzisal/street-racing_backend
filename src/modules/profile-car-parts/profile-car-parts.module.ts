import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileCarPart } from 'src/entities/profile-car-part.entity';
import { ProfileCar } from 'src/entities/profile-car.entity';
import { Part } from 'src/entities/part.entity';
import { ProfileCarPartRepository } from 'src/repositories/profile-car-part.repository';
import { ProfileCarRepository } from 'src/repositories/profile-car.repository';
import { PartRepository } from 'src/repositories/part.repository';
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
