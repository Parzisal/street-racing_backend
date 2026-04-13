import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Settings } from 'src/entities/settings.entity';
import { SettingsRepository } from 'src/repositories/settings.repository';
import { CarRepository } from 'src/repositories/car.repository';
import { CreateSettingsDto } from './create-settings.dto';
import { UpdateSettingsDto } from './update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly carRepository: CarRepository,
  ) {}

  private async ensureCarExists(carId: string | null | undefined): Promise<void> {
    if (carId === undefined || carId === null) {
      return;
    }
    const car = await this.carRepository.findOne({ where: { id: carId } });
    if (!car) {
      throw new BadRequestException(`Машина ${carId} не найдена`);
    }
  }

  async create(dto: CreateSettingsDto): Promise<Settings> {
    await this.ensureCarExists(dto.defaultCarId ?? null);
    const id = dto.id ?? 1;
    const existing = await this.settingsRepository.findOne({ where: { id } });
    if (existing) {
      throw new BadRequestException(`Настройки с id=${id} уже существуют`);
    }
    const row = this.settingsRepository.create({
      id,
      defaultStartLevel: dto.defaultStartLevel ?? 1,
      defaultExperience: dto.defaultExperience ?? 0,
      defaultSilver: dto.defaultSilver ?? 5000,
      defaultGold: dto.defaultGold ?? 10,
      defaultGarageSlots: dto.defaultGarageSlots ?? 4,
      defaultCarId: dto.defaultCarId ?? null,
    });
    return this.settingsRepository.save(row);
  }

  async findAll(): Promise<Settings[]> {
    return this.settingsRepository.find();
  }

  async findOne(id: number): Promise<Settings> {
    const row = await this.settingsRepository.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Настройки с id ${id} не найдены`);
    }
    return row;
  }

  async update(id: number, dto: UpdateSettingsDto): Promise<Settings> {
    await this.ensureCarExists(dto.defaultCarId);
    const row = await this.findOne(id);
    Object.assign(row, dto);
    return this.settingsRepository.save(row);
  }

  async remove(id: number): Promise<void> {
    const result = await this.settingsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Настройки с id ${id} не найдены`);
    }
  }
}
