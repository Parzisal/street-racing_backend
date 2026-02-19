import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Player } from '../../models/player.schema';
import { Part } from '../../models/part.schema';

@Injectable()
export class GarageService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<any>,
    @InjectModel(Part.name) private partModel: Model<any>,
  ) {}

  async getGarage(playerId: string) {
    const player = await this.playerModel
      .findById(playerId)
      .populate('ownedCars.car', 'name basePower imageUrl thumbnailUrl rating')
      .populate('ownedCars.parts.part', 'name defaultIconUrl levels')
      .exec();

    if (!player) throw new BadRequestException('Player not found');

    return player.ownedCars.map((owned, index) => {
      const car = owned.car || {};
      const parts = owned.parts.map((p) => {
        const part = p.part || {};
        const levelData = part.levels?.find((l) => l.level === p.level) || {};

        return {
          partId: part._id?.toString() || p.part.toString(),
          name: part.name || 'Неизвестная запчасть',
          level: p.level,
          powerBoost: levelData.powerBoost || 0,
          iconUrl: levelData.iconUrl || part.defaultIconUrl || '',
        };
      });

      return {
        index,
        name: car.name || 'Неизвестно',
        power: owned.power,
        rating: car.rating || 0,
        imageUrl: car.imageUrl || '',
        thumbnailUrl: car.thumbnailUrl || '',
        isActive: index === player.activeCarIndex,
        sellPrice: owned.sellPrice,
        parts,
      };
    });
  }

  async sellCar(playerId: string, carId: string) {
    const player = await this.playerModel.findById(playerId);
    if (!player) {
      throw new BadRequestException('Player not found');
    }

    // нельзя продать единственный автомобиль в гараже
    if (player.ownedCars.length <= 1) {
      throw new BadRequestException('Cannot sell the only car in garage');
    }

    const carIndex = player.ownedCars.findIndex((oc: any) => oc.car.toString() === carId);
    if (carIndex === -1) throw new BadRequestException('Car not owned');

    const ownedCar = player.ownedCars[carIndex];

    player.silver += ownedCar.sellPrice;
    player.stats.earnedMoney += ownedCar.sellPrice;

    player.ownedCars.splice(carIndex, 1);

    // Если продали выбранную машину — сбрасываем выбор
    if (player.selectedCarId?.toString() === carId) {
      player.selectedCarId = player.ownedCars.length > 0 ? player.ownedCars[0].car : null;
    }

    await player.save();

    return {
      success: true,
      changes: {
        silver: player.silver,
        stats: { earnedMoney: player.stats.earnedMoney },
        selectedCarId: player.selectedCarId?.toString() || null,
      },
    };
  }

  async selectCar(playerId: string, carId: string) {
    const player = await this.playerModel.findById(playerId);
    if (!player) throw new BadRequestException('Player not found');

    const carExists = player.ownedCars.some((oc: any) => oc.car.toString() === carId);
    if (!carExists) throw new BadRequestException('Car not owned');

    player.selectedCarId = new Types.ObjectId(carId);
    await player.save();

    return {
      success: true,
      changes: {
        selectedCarId: carId,
      },
    };
  }
}
