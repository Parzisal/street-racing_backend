import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProfileCar } from 'src/entities/profile-car.entity';
import { ProfileCarRepository } from 'src/repositories/profile-car.repository';
import { ProfileRepository } from 'src/repositories/profile.repository';
import { CarRepository } from 'src/repositories/car.repository';
import { CreateProfileCarDto } from './create-profile-car.dto';
import { UpdateProfileCarDto } from './update-profile-car.dto';

@Injectable()
export class ProfileCarsService {
  constructor(
    private readonly profileCarRepository: ProfileCarRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly carRepository: CarRepository,
  ) {}

  async create(dto: CreateProfileCarDto): Promise<ProfileCar> {
    const profile = await this.profileRepository.findOne({
      where: { id: dto.profileId },
    });
    if (!profile) {
      throw new BadRequestException(`Профиль ${dto.profileId} не найден`);
    }
    const car = await this.carRepository.findOne({ where: { id: dto.carId } });
    if (!car) {
      throw new BadRequestException(`Машина ${dto.carId} не найдена`);
    }
    const row = this.profileCarRepository.create({
      profileId: dto.profileId,
      carId: dto.carId,
    });
    return this.profileCarRepository.save(row);
  }

  async findAll(): Promise<ProfileCar[]> {
    return this.profileCarRepository.find();
  }

  async findByProfileId(profileId: string): Promise<ProfileCar[]> {
    return this.profileCarRepository.find({ where: { profileId } });
  }

  async findOne(id: string): Promise<ProfileCar> {
    const row = await this.profileCarRepository.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Запись гаража с ID ${id} не найдена`);
    }
    return row;
  }

  async update(id: string, dto: UpdateProfileCarDto): Promise<ProfileCar> {
    const row = await this.findOne(id);
    if (dto.profileId !== undefined) {
      const profile = await this.profileRepository.findOne({
        where: { id: dto.profileId },
      });
      if (!profile) {
        throw new BadRequestException(`Профиль ${dto.profileId} не найден`);
      }
      row.profileId = dto.profileId;
    }
    if (dto.carId !== undefined) {
      const car = await this.carRepository.findOne({ where: { id: dto.carId } });
      if (!car) {
        throw new BadRequestException(`Машина ${dto.carId} не найдена`);
      }
      row.carId = dto.carId;
    }
    return this.profileCarRepository.save(row);
  }

  async remove(id: string): Promise<void> {
    const result = await this.profileCarRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Запись гаража с ID ${id} не найдена`);
    }
  }
}
