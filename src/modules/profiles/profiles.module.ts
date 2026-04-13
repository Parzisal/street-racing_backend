import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileCar } from 'src/entities/profile-car.entity';
import { ProfileCarPart } from 'src/entities/profile-car-part.entity';
import { Car } from 'src/entities/car.entity';
import { Part } from 'src/entities/part.entity';
import { Settings } from 'src/entities/settings.entity';
import { ProfileRepository } from 'src/repositories/profile.repository';
import { CarRepository } from 'src/repositories/car.repository';
import { PartRepository } from 'src/repositories/part.repository';
import { SettingsRepository } from 'src/repositories/settings.repository';
import { ProfileCarRepository } from 'src/repositories/profile-car.repository';
import { ProfileCarPartRepository } from 'src/repositories/profile-car-part.repository';
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
