import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileCar } from 'src/entities/profile-car.entity';
import { Profile } from 'src/entities/profile.entity';
import { Car } from 'src/entities/car.entity';
import { ProfileCarRepository } from 'src/repositories/profile-car.repository';
import { ProfileRepository } from 'src/repositories/profile.repository';
import { CarRepository } from 'src/repositories/car.repository';
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
