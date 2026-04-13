import { Injectable, NotFoundException } from '@nestjs/common';
import { Part } from '@entities/part.entity';
import { PartRepository } from '@repositories/part.repository';
import { CreatePartDto } from './create-part.dto';
import { UpdatePartDto } from './update-part.dto';

@Injectable()
export class PartsService {
  constructor(private readonly partRepository: PartRepository) {}

  async create(dto: CreatePartDto): Promise<Part> {
    const part = this.partRepository.create(dto);

    return this.partRepository.save(part);
  }

  async findAll(): Promise<Part[]> {
    return this.partRepository.find();
  }

  async findOne(id: string): Promise<Part> {
    const part = await this.partRepository.findOne({ where: { id } });

    if (!part) {
      throw new NotFoundException(`Деталь с ID ${id} не найдена`);
    }

    return part;
  }

  async update(id: string, dto: UpdatePartDto): Promise<Part> {
    const part = await this.findOne(id);
    Object.assign(part, dto);

    return this.partRepository.save(part);
  }

  async remove(id: string): Promise<void> {
    const result = await this.partRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Деталь с ID ${id} не найдена`);
    }
  }
}
