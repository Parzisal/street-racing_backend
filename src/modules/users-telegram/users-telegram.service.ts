import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersTelegram } from '@entities/users-telegram.entity';
import { UsersTelegramRepository } from '@repositories/users-telegram.repository';
import { ProfileRepository } from '@repositories/profile.repository';
import { CreateUsersTelegramDto } from './create-users-telegram.dto';
import { UpdateUsersTelegramDto } from './update-users-telegram.dto';

@Injectable()
export class UsersTelegramService {
  constructor(
    private readonly usersTelegramRepository: UsersTelegramRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async create(dto: CreateUsersTelegramDto): Promise<UsersTelegram> {
    const profile = await this.profileRepository.findOne({
      where: { id: dto.profileId },
    });

    if (!profile) {
      throw new BadRequestException(`Профиль ${dto.profileId} не найден`);
    }

    const row = this.usersTelegramRepository.create({
      profileId: dto.profileId,
    });

    return this.usersTelegramRepository.save(row);
  }

  async findAll(): Promise<UsersTelegram[]> {
    return this.usersTelegramRepository.find();
  }

  async findByProfileId(profileId: string): Promise<UsersTelegram[]> {
    return this.usersTelegramRepository.find({ where: { profileId } });
  }

  async findOne(id: string): Promise<UsersTelegram> {
    const row = await this.usersTelegramRepository.findOne({ where: { id } });

    if (!row) {
      throw new NotFoundException(`Пользователь Telegram с ID ${id} не найден`);
    }

    return row;
  }

  async update(
    id: string,
    dto: UpdateUsersTelegramDto,
  ): Promise<UsersTelegram> {
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

    return this.usersTelegramRepository.save(row);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersTelegramRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Пользователь Telegram с ID ${id} не найден`);
    }
  }
}
