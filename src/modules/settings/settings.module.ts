import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '@entities/settings.entity';
import { Car } from '@entities/car.entity';
import { SettingsRepository } from '@repositories/settings.repository';
import { CarRepository } from '@repositories/car.repository';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Settings, Car])],
  controllers: [SettingsController],
  providers: [SettingsRepository, CarRepository, SettingsService],
  exports: [SettingsService, SettingsRepository],
})
export class SettingsModule {}
