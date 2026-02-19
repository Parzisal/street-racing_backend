import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model } from 'mongoose';
import { Car } from 'src/models/car.schema';
import { Part } from 'src/models/part.schema';
import { Player, PlayerDocument } from '../../models/player.schema';
import type { PlayerCarDto, PlayerGetDto } from '../../types/player.types';
import type { PlayerLean } from '../../types/player-db.types';

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

  async getPlayer(playerId: string): Promise<PlayerGetDto> {
    const existing = await this.playerModel.findOne({ userId: playerId });

    if (!existing) {
      await this.createDefaultPlayer(playerId);
    }

    const player = await this.playerModel
      .findOne({ userId: playerId })
      .populate([
        {
          path: 'ownedCars.carRef',
          select: 'name basePower imageUrl thumbnailUrl rating',
        },
        {
          path: 'ownedCars.parts.partRef',
          select: 'name defaultIconUrl upgradeLevels type',
        },
      ])
      .lean<PlayerLean>()
      .exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const ownedCars: PlayerCarDto[] = player.ownedCars.map(
      ({ carRef, power, sellPrice, parts }) => ({
        carId: carRef._id.toString(),
        name: carRef.name,
        basePower: carRef.basePower,
        currentPower: power,
        rating: carRef.rating,
        imageUrl: carRef.imageUrl,
        thumbnailUrl: carRef.thumbnailUrl,
        sellPrice,
        parts: parts.map(({ partRef, level }) => {
          const lvl = partRef.upgradeLevels.find((l) => l.level === level);

          return {
            partId: partRef._id.toString(),
            name: partRef.name,
            level,
            powerBoost: lvl?.powerBoost ?? 0,
            iconUrl: lvl?.iconUrl,
          };
        }),
      }),
    );

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
    const initialOwnedCar = {
      _id: ownedCarId,
      carRef: firstCar._id,
      power: firstCar.basePower,
      sellPrice: Math.round(firstCar.priceSilver * 0.7),
      parts: allParts.map((part) => ({
        partRef: part._id,
        level: 0, // начинаем с 0 уровня
      })),
    };

    // Создаём игрока
    const newPlayer = new this.playerModel({
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
      // сразу выбираем первую машину из гаража
      ownedCars: [initialOwnedCar],
      selectedCarId: ownedCarId, // пока можно null или сразу взять _id после сохранения
      recentChallenges: [],
    });

    // Сохраняем, чтобы получить _id для selectedOwnedCarId
    // await newPlayer.save();

    // Назначаем выбранную машину
    // newPlayer.selectedCarId = newPlayer.ownedCars[0]._id;
    await newPlayer.save();

    return newPlayer;
  }
}
