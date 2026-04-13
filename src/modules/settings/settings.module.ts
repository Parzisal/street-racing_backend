import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from 'src/entities/settings.entity';
import { Car } from 'src/entities/car.entity';
import { SettingsRepository } from 'src/repositories/settings.repository';
import { CarRepository } from 'src/repositories/car.repository';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Settings, Car])],
  controllers: [SettingsController],
  providers: [SettingsRepository, CarRepository, SettingsService],
  exports: [SettingsService, SettingsRepository],
})
export class SettingsModule {}
