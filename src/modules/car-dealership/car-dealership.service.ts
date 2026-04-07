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
  async getAvailableCars(playerId: string) {
    const player = await this.playerModel
      .findOne({ userId: playerId })
      .lean()
      .exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const maxCarLevel = player.level + 1;

    const cars = await this.carModel
      .find({ level: { $lte: maxCarLevel } })
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

  async buyCar(playerId: string, carId: string) {
    const player = await this.playerModel.findOne({ userId: playerId });

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
    player.ownedCars.push(ownedCar);

    // ⭐ Сразу выбираем её
    player.selectedCarId = ownedCarId;

    await player.save();

    return {
      silver: player.silver,
      gold: player.gold,
      selectedCarId: player.selectedCarId.toString(),
      ownedCars: player.ownedCars, // Придумать как вернуть автомобили, щас рассинхрон будто бы
      stats: {
        spentMoney: player.stats.spentMoney,
      },
    };
  }

  //   async getAvailableCars(playerId: string) {
  //     const player = await this.playerModel
  //       .findById(playerId)
  //       .select('level ownedCars');
  //     if (!player) throw new BadRequestException('Player not found');

  //     const cars = await this.carModel.find().lean();

  //     const owned = new Set(player.ownedCars.map((c) => c.car.toString()));

  //     return cars.map((car) => ({
  //       id: car._id.toString(),
  //       name: car.name,
  //       basePower: car.basePower,
  //       levelRequired: car.levelRequired,
  //       price: { silver: car.priceSilver, gold: car.priceGold },
  //       rating: car.rating,
  //       imageUrl: car.imageUrl || '',
  //       thumbnailUrl: car.thumbnailUrl || '',
  //       isOwned: owned.has(car._id.toString()),
  //       canBuyByLevel:
  //         car.levelRequired <= player.level && !owned.has(car._id.toString()),
  //       isVisible: car.levelRequired <= player.level + 1,
  //       isBlurred: car.levelRequired > player.level + 1,
  //     }));
  //   }

  //   async buyCar(playerId: string, carId: string) {
  //     const player = await this.playerModel.findById(playerId);
  //     const car = await this.carModel.findById(carId);

  //     if (!player || !car) throw new BadRequestException('Not found');

  //     if (car.levelRequired > player.level)
  //       throw new BadRequestException(`Required level ${car.levelRequired}`);
  //     if (player.ownedCars.length >= player.garageSlots)
  //       throw new BadRequestException('Garage full');
  //     if (player.silver < car.priceSilver || player.gold < car.priceGold)
  //       throw new BadRequestException('Insufficient funds');

  //     player.silver -= car.priceSilver;
  //     player.gold -= car.priceGold;
  //     player.stats.spentMoney += car.priceSilver;

  //     const partsTemplates = await this.partModel.find();
  //     const newCar = {
  //       car: car._id,
  //       power: car.basePower,
  //       sellPrice: Math.round(car.priceSilver * 0.65),
  //       parts: partsTemplates.map((p) => ({ part: p._id, level: 0, stars: 0 })),
  //     };

  //     player.ownedCars.push(newCar);
  //     const newIndex = player.ownedCars.length - 1;
  //     player.selectedCarId = car._id;

  //     await player.save();

  //     return {
  //       success: true,
  //       changes: {
  //         silver: player.silver,
  //         gold: player.gold,
  //         selectedCarId: car._id.toString(),
  //         newCarIndex: newIndex,
  //         newCar: newCar,
  //       },
  //     };
  //   }
}
