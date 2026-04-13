import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@entities/profile.entity';
import { ProfileCar } from '@entities/profile-car.entity';
import { ProfileCarPart } from '@entities/profile-car-part.entity';
import { Car } from '@entities/car.entity';
import { Part } from '@entities/part.entity';
import { Settings } from '@entities/settings.entity';
import { ProfileRepository } from '@repositories/profile.repository';
import { CarRepository } from '@repositories/car.repository';
import { PartRepository } from '@repositories/part.repository';
import { SettingsRepository } from '@repositories/settings.repository';
import { ProfileCarRepository } from '@repositories/profile-car.repository';
import { ProfileCarPartRepository } from '@repositories/profile-car-part.repository';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      ProfileCar,
      ProfileCarPart,
      Car,
      Part,
      Settings,
    ]),
  ],
  controllers: [ProfilesController],
  providers: [
    ProfileRepository,
    CarRepository,
    PartRepository,
    SettingsRepository,
    ProfileCarRepository,
    ProfileCarPartRepository,
    ProfilesService,
  ],
  exports: [ProfilesService, ProfileRepository],
})
export class ProfilesModule {}
