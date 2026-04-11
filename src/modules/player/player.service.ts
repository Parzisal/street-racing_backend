import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model } from 'mongoose';
import { Car } from 'src/models/car.schema';
import { Part } from 'src/models/part.schema';
import { OwnedCar, Player, PlayerDocument } from '../../models/player.schema';
import type { PlayerGetDto } from '../../types/player-dto.types';
import { mapOwnedCarsToDto } from './player-owned-cars.mapper';

type PlayerLeanDoc = {
  userId: string;
  username: string;
  level: number;
  experience: number;
  silver: number;
  gold: number;
  fuel: {
    current: number;
    max: number;
    lastRefill: Date;
  };
  garageSlots: number;
  selectedCarId: Types.ObjectId | null;
  stats: {
    totalRaces: number;
    wins: number;
    losses: number;
    spentMoney: number;
    earnedMoney: number;
    racesForLevel: number;
    challengesReceived: number;
  };
  recentChallenges: Array<{
    challengerId: Types.ObjectId;
    raceId: Types.ObjectId;
    date: Date;
  }>;
  ownedCars: Array<OwnedCar>;
};

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
    @InjectModel(Car.name)
    private readonly carModel: Model<Car>,
    @InjectModel(Part.name)
    private readonly partModel: Model<Part>,
  ) {}

  async getPlayer(userId: string): Promise<PlayerGetDto> {
    const existing = await this.playerModel.exists({ userId });
    if (!existing) {
      await this.createDefaultPlayer(userId);
    }

    const player = await this.playerModel
      .findOne({ userId })
      .lean<PlayerLeanDoc>()
      .exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const carIds = player.ownedCars.map((car) => car.carRef);
    const partIds = player.ownedCars.flatMap((car) =>
      car.parts.map((part) => part.partRef),
    );

    const [cars, parts] = await Promise.all([
      this.carModel
        .find({ _id: { $in: carIds } })
        .select('name imageUrl')
        .lean()
        .exec(),
      this.partModel
        .find({ _id: { $in: partIds } })
        .select('name upgradeLevels')
        .lean()
        .exec(),
    ]);

    const ownedCars = mapOwnedCarsToDto(player.ownedCars, cars, parts);

    return {
      userId: player.userId,
      username: player.username,
      level: player.level,
      experience: player.experience,
      silver: player.silver,
      gold: player.gold,
      fuel: player.fuel,
      garageSlots: player.garageSlots,
      selectedCarId: player.selectedCarId?.toString(),
      stats: player.stats,
      recentChallenges: player.recentChallenges.map((c) => ({
        challengerId: c.challengerId.toString(),
        raceId: c.raceId.toString(),
        date: c.date,
      })),
      ownedCars,
    };
  }

  //   private calculateFuel(fuel: any): any {
  //     const now = Date.now();
  //     const timePassed = Math.floor(
  //       (now - new Date(fuel.lastRefill).getTime()) / 300000,
  //     );
  //     fuel.current = Math.min(fuel.max, fuel.current + timePassed);
  //     fuel.lastRefill = new Date(now - timePassed * 300000);
  //     return fuel;
  //   }

  async createDefaultPlayer(userId: string): Promise<PlayerDocument> {
    // Находим первую машину из автосалона (по уровню или цене)
    const firstCar = await this.carModel.findOne().sort().exec();
    if (!firstCar) {
      throw new NotFoundException('В автосалоне нет ни одной машины');
    }

    // Получаем все доступные запчасти
    const allParts = await this.partModel.find().exec();
    if (allParts.length === 0) {
      throw new NotFoundException('Нет доступных запчастей для установки');
    }

    const ownedCarId = new Types.ObjectId();

    // Формируем начальную машину с запчастями 0 уровня
    const initialOwnedCar: OwnedCar = {
      _id: ownedCarId,
      carRef: firstCar._id,
      power: firstCar.basePower,
      sellPrice: Math.round(firstCar.priceSilver * 0.7),
      parts: allParts.map((part) => {
        const generatedPartId = new Types.ObjectId();

        return {
          _id: generatedPartId,
          partRef: part._id,
          level: 0, // начинаем с 0 уровня
        };
      }),
    };

    // Создаём игрока
    const newPlayerData: Partial<Player> = {
      username: 'empty',
      userId,
      level: 1,
      experience: 0,
      silver: 5000,
      gold: 10,
      fuel: {
        current: 100,
        max: 100,
        lastRefill: new Date(),
      },
      garageSlots: 4,
      stats: {
        totalRaces: 0,
        wins: 0,
        losses: 0,
        spentMoney: 0,
        earnedMoney: 0,
        racesForLevel: 0,
        challengesReceived: 0,
      },
      ownedCars: [initialOwnedCar],
      selectedCarId: ownedCarId,
      recentChallenges: [],
    };

    const newPlayer = new this.playerModel(newPlayerData);

    await newPlayer.save();

    return newPlayer;
  }
}
