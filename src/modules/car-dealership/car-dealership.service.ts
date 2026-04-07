import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OwnedCar, Player, PlayerDocument } from '../../models/player.schema';
import { Car } from '../../models/car.schema';
import { Part } from '../../models/part.schema';
import { mapOwnedCarsToDto } from '../player/player-owned-cars.mapper';

@Injectable()
export class CarDealershipService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Car.name) private carModel: Model<Car>,
    @InjectModel(Part.name) private partModel: Model<Part>,
  ) {}

  // --------------------------------------------------
  // 🚗 Машины, доступные игроку
  // --------------------------------------------------
  async getAvailableCars(userId: string) {
    const player = await this.playerModel.findOne({ userId }).lean().exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const maxCarLevel = player.level + 1;

    const cars = await this.carModel
      .find({ level: { $lte: maxCarLevel } })
      .sort({ level: 1 })
      .lean()
      .exec();

    return cars.map((car) => ({
      carId: car._id.toString(),
      name: car.name,
      carModel: car.carModel,
      basePower: car.basePower,
      level: car.level,
      priceSilver: car.priceSilver,
      priceGold: car.priceGold,
      imageUrl: car.imageUrl,
    }));
  }

  async buyCar(userId: string, carId: string) {
    const player = await this.playerModel.findOne({ userId });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const car = await this.carModel.findById(carId).lean().exec();
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    // 🔒 Проверка уровня
    if (car.level > player.level + 1) {
      throw new BadRequestException('Car level is too high');
    }

    // 🔒 Проверка денег
    if (car.priceSilver > 0 && player.silver < car.priceSilver) {
      throw new BadRequestException('Not enough silver');
    }

    if (car.priceGold > 0 && player.gold < car.priceGold) {
      throw new BadRequestException('Not enough gold');
    }

    // 🔒 Проверка гаража
    if (player.ownedCars.length >= player.garageSlots) {
      throw new BadRequestException('Garage is full');
    }

    // 🔧 Все запчасти с нулевым уровнем
    const parts = await this.partModel.find().lean().exec();

    const ownedCarId = new Types.ObjectId();

    const ownedCar: OwnedCar = {
      _id: ownedCarId,
      carRef: car._id,
      power: car.basePower,
      sellPrice: Math.round(car.priceSilver * 0.7),
      parts: parts.map((p) => ({
        partRef: p._id,
        level: 0,
      })),
    };

    // 💸 Списываем деньги
    player.silver -= car.priceSilver;
    player.gold -= car.priceGold;
    player.stats.spentMoney += car.priceSilver;

    // 🚗 Добавляем в гараж
    player.ownedCars.unshift(ownedCar);

    // ⭐ Сразу выбираем её
    player.selectedCarId = ownedCarId;

    await player.save();

    const carIds = player.ownedCars.map((item) => item.carRef);
    const allCars = await this.carModel
      .find({ _id: { $in: carIds } })
      .select('name imageUrl')
      .lean()
      .exec();

    const ownedCars = mapOwnedCarsToDto(player.ownedCars, allCars, parts);

    return {
      success: true,
      changes: {
        silver: player.silver,
        gold: player.gold,
        selectedCarId: ownedCarId.toString(),
        ownedCars,
        stats: {
          spentMoney: player.stats.spentMoney,
        },
      },
    };
  }
}
