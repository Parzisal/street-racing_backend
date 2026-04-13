import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileCar } from 'src/entities/profile-car.entity';
import { ProfileCarPart } from 'src/entities/profile-car-part.entity';
import { ProfileRepository } from 'src/repositories/profile.repository';
import { UpdateProfileDto } from './update-profile.dto';
import { SettingsRepository } from 'src/repositories/settings.repository';
import { CarRepository } from 'src/repositories/car.repository';
import { PartRepository } from 'src/repositories/part.repository';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly partsRepository: PartRepository,
    private readonly settingsRepository: SettingsRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createDefault(): Promise<Profile> {
    const appSettings = await this.settingsRepository.findOne({
      where: { id: 1 },
    });
    if (!appSettings) {
      throw new NotFoundException(`Настройки не найдены`);
    }

    if (!appSettings.defaultCarId) {
      throw new NotFoundException(`Default car id not found`);
    }

    const car = await this.carRepository.findOne({
      where: { id: appSettings.defaultCarId },
    });
    if (!car) {
      throw new NotFoundException(`Default car not found`);
    }

    const parts = await this.partsRepository.find({ where: { level: 0 } });
    if (parts.length === 0) {
      throw new NotFoundException(`Parts not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      const profileRepo = manager.getRepository(Profile);
      const profileCarRepo = manager.getRepository(ProfileCar);
      const profileCarPartRepo = manager.getRepository(ProfileCarPart);

      const profile = profileRepo.create({
        id: uuidv7(),
        level: appSettings.defaultStartLevel,
        experience: appSettings.defaultExperience,
        silver: appSettings.defaultSilver,
        gold: appSettings.defaultGold,
        garageSlots: appSettings.defaultGarageSlots,
      });
      await profileRepo.save(profile);

      const profileCar = profileCarRepo.create({
        id: uuidv7(),
        profileId: profile.id,
        carId: car.id,
      });
      await profileCarRepo.save(profileCar);

      await profileRepo.update(profile.id, { selectedCarId: profileCar.id });

      const profileCarParts = parts.map((part) =>
        profileCarPartRepo.create({
          profileCarId: profileCar.id,
          partId: part.id,
        }),
      );
      await profileCarPartRepo.save(profileCarParts);

      profile.selectedCarId = profileCar.id;
      return profile;
    });
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find();
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Профиль с ID ${id} не найден`);
    }
    return profile;
  }

  async update(id: string, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);
    Object.assign(profile, dto);
    return this.profileRepository.save(profile);
  }

  async remove(id: string): Promise<void> {
    const result = await this.profileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Профиль с ID ${id} не найден`);
    }
  }
}
