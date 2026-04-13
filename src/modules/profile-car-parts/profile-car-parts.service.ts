import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProfileCarPart } from '@entities/profile-car-part.entity';
import { ProfileCarPartRepository } from '@repositories/profile-car-part.repository';
import { ProfileCarRepository } from '@repositories/profile-car.repository';
import { PartRepository } from '@repositories/part.repository';
import { CreateProfileCarPartDto } from './create-profile-car-part.dto';

@Injectable()
export class ProfileCarPartsService {
  constructor(
    private readonly profileCarPartRepository: ProfileCarPartRepository,
    private readonly profileCarRepository: ProfileCarRepository,
    private readonly partRepository: PartRepository,
  ) {}

  async create(dto: CreateProfileCarPartDto): Promise<ProfileCarPart> {
    const profileCar = await this.profileCarRepository.findOne({
      where: { id: dto.profileCarId },
    });

    if (!profileCar) {
      throw new BadRequestException(
        `Запись гаража ${dto.profileCarId} не найдена`,
      );
    }

    const part = await this.partRepository.findOne({
      where: { id: dto.partId },
    });

    if (!part) {
      throw new BadRequestException(`Деталь ${dto.partId} не найдена`);
    }

    const row = this.profileCarPartRepository.create({
      profileCarId: dto.profileCarId,
      partId: dto.partId,
    });

    return this.profileCarPartRepository.save(row);
  }

  async findAll(): Promise<ProfileCarPart[]> {
    return this.profileCarPartRepository.find();
  }

  async findByProfileCarId(profileCarId: string): Promise<ProfileCarPart[]> {
    return this.profileCarPartRepository.find({ where: { profileCarId } });
  }

  async findOne(profileCarId: string, partId: string): Promise<ProfileCarPart> {
    const row = await this.profileCarPartRepository.findOne({
      where: { profileCarId, partId },
    });

    if (!row) {
      throw new NotFoundException(
        `Связь profileCar=${profileCarId}, part=${partId} не найдена`,
      );
    }

    return row;
  }

  async remove(profileCarId: string, partId: string): Promise<void> {
    const result = await this.profileCarPartRepository.delete({
      profileCarId,
      partId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Связь profileCar=${profileCarId}, part=${partId} не найдена`,
      );
    }
  }
}
