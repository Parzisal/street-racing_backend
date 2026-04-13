// src/cars/cars.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, MoreThan, LessThan, ILike } from 'typeorm';
import { CreateCarDto } from './create-car.dto';
import { UpdateCarDto } from './update-car.dto';
import { Car } from 'src/entities/car.entity';
import { CarRepository } from 'src/repositories/car.repository';

@Injectable()
export class CarsService {
  constructor(private readonly carsRepository: CarRepository) {}

  // CREATE - создание новой машины
  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = this.carsRepository.create(createCarDto);
    return await this.carsRepository.save(car);
  }

  // READ - получить все машины
  async findAll(): Promise<Car[]> {
    return await this.carsRepository.find();
  }

  // READ - получить одну машину по ID
  async findOne(id: string): Promise<Car> {
    const car = await this.carsRepository.findOne({ where: { id } });
    if (!car) {
      throw new NotFoundException(`Машина с ID ${id} не найдена`);
    }
    return car;
  }

  async update(id: string, dto: UpdateCarDto): Promise<Car> {
    const car = await this.findOne(id);
    Object.assign(car, dto);
    return this.carsRepository.save(car);
  }

  // READ - поиск по различным критериям
  async findByModel(model: string): Promise<Car[]> {
    return await this.carsRepository.find({
      where: { model: ILike(`%${model}%`) }, // регистронезависимый поиск
    });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Car[]> {
    return await this.carsRepository.find({
      where: {
        priceSilver: Between(minPrice, maxPrice),
      },
      order: { priceSilver: 'ASC' },
    });
  }

  async findAffordableBySilver(maxPrice: number): Promise<Car[]> {
    return await this.carsRepository.find({
      where: {
        priceSilver: LessThan(maxPrice),
      },
      order: { priceSilver: 'ASC' },
    });
  }

  async findHighPerformance(minPower: number): Promise<Car[]> {
    return await this.carsRepository.find({
      where: {
        basePower: MoreThan(minPower),
      },
      order: { basePower: 'DESC' },
    });
  }

  // READ - с сортировкой и пагинацией
  async findAllPaginated(page: number = 1, limit: number = 10): Promise<{
    data: Car[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.carsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // DELETE - удаление машины
  async remove(id: string): Promise<void> {
    const result = await this.carsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Машина с ID ${id} не найдена`);
    }
  }

  // DELETE - удалить все машины (осторожно!)
  async removeAll(): Promise<void> {
    await this.carsRepository.clear();
  }

  // Дополнительные методы для аналитики
  async getStats() {
    const [total, avgPower, avgRating, mostExpensive] = await Promise.all([
      this.carsRepository.count(),
      this.carsRepository
        .createQueryBuilder('car')
        .select('AVG(car.basePower)', 'avg')
        .getRawOne(),
      this.carsRepository
        .createQueryBuilder('car')
        .select('AVG(car.baseRating)', 'avg')
        .getRawOne(),
      this.carsRepository.findOne({
        where: {},
        order: { priceSilver: 'DESC' },
      }),
    ]);

    return {
      total,
      averagePower: Math.round(avgPower?.avg || 0),
      averageRating: Math.round(avgRating?.avg || 0),
      mostExpensiveCar: mostExpensive,
    };
  }

  // Сложный поиск с несколькими условиями
  async findAdvanced(params: {
    minPower?: number;
    maxPrice?: number;
    minRating?: number;
    model?: string;
  }): Promise<Car[]> {
    const queryBuilder = this.carsRepository.createQueryBuilder('car');

    if (params.minPower) {
      queryBuilder.andWhere('car.basePower >= :minPower', { minPower: params.minPower });
    }

    if (params.maxPrice) {
      queryBuilder.andWhere('car.priceSilver <= :maxPrice', { maxPrice: params.maxPrice });
    }

    if (params.minRating) {
      queryBuilder.andWhere('car.baseRating >= :minRating', { minRating: params.minRating });
    }

    if (params.model) {
      queryBuilder.andWhere('car.model ILIKE :model', { model: `%${params.model}%` });
    }

    return await queryBuilder
      .orderBy('car.baseRating', 'DESC')
      .addOrderBy('car.priceSilver', 'ASC')
      .getMany();
  }
}