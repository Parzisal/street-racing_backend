import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Profile } from '@entities/profile.entity';
import { ProfileCar } from '@entities/profile-car.entity';
import { ProfileCarPart } from '@entities/profile-car-part.entity';
import { UsersTelegram } from '@entities/users-telegram.entity';
import { ProfileRepository } from '@repositories/profile.repository';
import { ProfileCarRepository } from '@repositories/profile-car.repository';
import { ProfileCarPartRepository } from '@repositories/profile-car-part.repository';
import { UpdateProfileDto } from './update-profile.dto';
import { SettingsRepository } from '@repositories/settings.repository';
import { CarRepository } from '@repositories/car.repository';
import { PartRepository } from '@repositories/part.repository';
import { uuidv7 } from 'uuidv7';
import {
  FrontendCarDto,
  FrontendGarageCarDto,
  FrontendPartDto,
  FrontendProfileDto,
} from './dto/profile-frontend.dto';
import { DealershipCarDto } from './dto/dealership-car.dto';
import { calculatePartResaleFactor } from '@utils/calculate-part.util';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly partsRepository: PartRepository,
    private readonly settingsRepository: SettingsRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly profileCarRepository: ProfileCarRepository,
    private readonly profileCarPartRepository: ProfileCarPartRepository,
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
    await this.dataSource.transaction(async (manager) => {
      const profileRepo = manager.getRepository(Profile);
      const profileCarRepo = manager.getRepository(ProfileCar);
      const profileCarPartRepo = manager.getRepository(ProfileCarPart);
      const usersTelegramRepo = manager.getRepository(UsersTelegram);

      const profile = await profileRepo.findOne({ where: { id } });

      if (!profile) {
        throw new NotFoundException(`Профиль с ID ${id} не найден`);
      }

      // Break cyclic FK chain: profiles.selected_car_id -> profiles_cars.id.
      profile.selectedCarId = null;
      await profileRepo.save(profile);

      const profileCars = await profileCarRepo.find({
        where: { profileId: id },
      });
      const profileCarIds = profileCars.map((profileCar) => profileCar.id);

      if (profileCarIds.length > 0) {
        await profileCarPartRepo
          .createQueryBuilder()
          .delete()
          .where('profile_car_id IN (:...ids)', { ids: profileCarIds })
          .execute();
      }

      await profileCarRepo.delete({ profileId: id });
      await usersTelegramRepo.delete({ profileId: id });
      await profileRepo.delete(id);
    });
  }

  async getMyProfile(profileId: string): Promise<FrontendProfileDto> {
    const profile = await this.findOne(profileId);
    const profileCars = await this.profileCarRepository.find({
      where: { profileId },
      relations: { car: true },
    });

    const profileCarIds = profileCars.map((car) => car.id);
    const partsByProfileCarId = new Map<string, FrontendPartDto[]>();

    if (profileCarIds.length > 0) {
      const profileCarParts = await this.profileCarPartRepository.find({
        where: profileCarIds.map((profileCarId) => ({ profileCarId })),
        relations: { part: true },
      });

      for (const profileCarPart of profileCarParts) {
        const currentParts =
          partsByProfileCarId.get(profileCarPart.profileCarId) ?? [];
        currentParts.push({
          id: profileCarPart.part.id,
          name: profileCarPart.part.name,
          level: profileCarPart.part.level,
          powerBoost: profileCarPart.part.powerBoost,
          priceSilver: profileCarPart.part.priceSilver,
          imageUrl: profileCarPart.part.imageUrl,
        });
        partsByProfileCarId.set(profileCarPart.profileCarId, currentParts);
      }
    }

    const garage: FrontendGarageCarDto[] = profileCars.map((profileCar) => {
      const car: FrontendCarDto = {
        id: profileCar.car.id, // выглядит бесполезным для ui
        name: profileCar.car.name,
        model: profileCar.car.model,
        basePower: profileCar.car.basePower,
        baseRating: profileCar.car.baseRating,
        buyLevel: profileCar.car.buyLevel,
        priceSilver: profileCar.car.priceSilver,
        priceGold: profileCar.car.priceGold,
        imageUrl: profileCar.car.imageUrl,
      };

      return {
        profileCarId: profileCar.id,
        car,
        parts: partsByProfileCarId.get(profileCar.id) ?? [],
      };
    });

    return {
      level: profile.level,
      experience: profile.experience,
      silver: profile.silver,
      gold: profile.gold,
      garageSlots: profile.garageSlots,
      selectedCarId: profile.selectedCarId,
      garage,
    };
  }

  async getAvailableDealershipCars(profileId: string): Promise<DealershipCarDto[]> {
    const profile = await this.findOne(profileId);
    const cars = await this.carRepository.find({
      order: { buyLevel: 'ASC', priceSilver: 'ASC' },
    });
    const maxVisibleLevel = profile.level + 1;

    return cars
      .filter((car) => car.buyLevel <= maxVisibleLevel)
      .map((car) => ({
        id: car.id,
        name: car.name,
        model: car.model,
        buyLevel: car.buyLevel,
        priceSilver: car.priceSilver,
        priceGold: car.priceGold,
        imageUrl: car.imageUrl,
      }));
  }

  async buyDealershipCar(profileId: string, carId: string): Promise<Profile> {
    const profile = await this.findOne(profileId);
    const car = await this.carRepository.findOne({ where: { id: carId } });

    if (!car) {
      throw new NotFoundException(`Машина с ID ${carId} не найдена`);
    }

    if (car.buyLevel > profile.level) {
      throw new BadRequestException(
        `Требуется уровень ${car.buyLevel}, текущий уровень ${profile.level}`,
      );
    }

    const ownedCarsCount = await this.profileCarRepository.count({
      where: { profileId },
    });

    if (ownedCarsCount >= profile.garageSlots) {
      throw new BadRequestException(`В гараже нет свободных слотов`);
    }

    if (profile.silver < car.priceSilver) {
      throw new BadRequestException(`Недостаточно серебра`);
    }

    if (profile.gold < car.priceGold) {
      throw new BadRequestException(`Недостаточно золота`);
    }

    return this.dataSource.transaction(async (manager) => {
      const profileRepo = manager.getRepository(Profile);
      const profileCarRepo = manager.getRepository(ProfileCar);
      const profileCarPartRepo = manager.getRepository(ProfileCarPart);

      const dbProfile = await profileRepo.findOne({ where: { id: profileId } });

      if (!dbProfile) {
        throw new NotFoundException(`Профиль с ID ${profileId} не найден`);
      }

      dbProfile.silver -= car.priceSilver;
      dbProfile.gold -= car.priceGold;

      const newProfileCar = profileCarRepo.create({
        id: uuidv7(),
        profileId: dbProfile.id,
        carId: car.id,
      });
      await profileCarRepo.save(newProfileCar);

      const baseParts = await this.partsRepository.find({
        where: { level: 0 },
      });
      const profileCarParts = baseParts.map((part) =>
        profileCarPartRepo.create({
          profileCarId: newProfileCar.id,
          partId: part.id,
        }),
      );
      await profileCarPartRepo.save(profileCarParts);

      dbProfile.selectedCarId = newProfileCar.id;

      return profileRepo.save(dbProfile);
    });
  }

  async selectCurrentCar(
    profileId: string,
    profileCarId: string,
  ): Promise<Profile> {
    const profile = await this.findOne(profileId);
    const profileCar = await this.profileCarRepository.findOne({
      where: { id: profileCarId },
    });

    if (!profileCar) {
      throw new NotFoundException(
        `Машина в гараже с ID ${profileCarId} не найдена`,
      );
    }

    if (profileCar.profileId !== profileId) {
      throw new BadRequestException(
        `Эта машина не принадлежит текущему профилю`,
      );
    }

    profile.selectedCarId = profileCar.id;

    return this.profileRepository.save(profile);
  }

  async sellGarageCar(
    profileId: string,
    profileCarId: string,
  ): Promise<{
    soldProfileCarId: string;
    silverRefund: number;
    goldRefund: number;
    partSilverRefund: number;
    newSelectedCarId: string | null;
  }> {
    const ownedCarsCount = await this.profileCarRepository.count({
      where: { profileId },
    });

    if (ownedCarsCount <= 1) {
      throw new BadRequestException(
        `Нельзя продать единственную машину в гараже`,
      );
    }

    const profileCar = await this.profileCarRepository.findOne({
      where: { id: profileCarId, profileId },
      relations: { car: true },
    });

    if (!profileCar) {
      throw new NotFoundException(
        `Машина в гараже с ID ${profileCarId} не найдена`,
      );
    }

    const installedParts = await this.profileCarPartRepository.find({
      where: { profileCarId },
      relations: { part: true },
    });

    const carSilverRefund = Math.floor(profileCar.car.priceSilver * 0.7);
    const carGoldRefund = Math.floor(profileCar.car.priceGold * 0.7);
    const partSilverRefund = installedParts.reduce((sum, profileCarPart) => {
      if (profileCarPart.part.level <= 0) {
        return sum;
      }

      const factor = calculatePartResaleFactor(profileCarPart.part.level);
      return sum + Math.floor(profileCarPart.part.priceSilver * factor);
    }, 0);
    const totalSilverRefund = carSilverRefund + partSilverRefund;

    return this.dataSource.transaction(async (manager) => {
      const profileRepo = manager.getRepository(Profile);
      const profileCarRepo = manager.getRepository(ProfileCar);
      const profileCarPartRepo = manager.getRepository(ProfileCarPart);

      const profile = await profileRepo.findOne({ where: { id: profileId } });

      if (!profile) {
        throw new NotFoundException(`Профиль с ID ${profileId} не найден`);
      }

      profile.silver += totalSilverRefund;
      profile.gold += carGoldRefund;

      if (profile.selectedCarId === profileCarId) {
        const replacementCar = await profileCarRepo.findOne({
          where: { profileId },
        });
        profile.selectedCarId = replacementCar?.id ?? null;
      }

      const savedProfile = await profileRepo.save(profile);

      await profileCarPartRepo.delete({ profileCarId });
      await profileCarRepo.delete({ id: profileCarId });


      return {
        soldProfileCarId: profileCarId,
        silverRefund: totalSilverRefund,
        goldRefund: carGoldRefund,
        partSilverRefund,
        newSelectedCarId: savedProfile.selectedCarId,
      };
    });
  }
}
