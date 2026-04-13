import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileCar } from '@entities/profile-car.entity';
import { Profile } from '@entities/profile.entity';
import { Car } from '@entities/car.entity';
import { ProfileCarRepository } from '@repositories/profile-car.repository';
import { ProfileRepository } from '@repositories/profile.repository';
import { CarRepository } from '@repositories/car.repository';
import { ProfileCarsController } from './profile-cars.controller';
import { ProfileCarsService } from './profile-cars.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileCar, Profile, Car])],
  controllers: [ProfileCarsController],
  providers: [
    ProfileCarRepository,
    ProfileRepository,
    CarRepository,
    ProfileCarsService,
  ],
  exports: [ProfileCarsService, ProfileCarRepository],
})
export class ProfileCarsModule {}
