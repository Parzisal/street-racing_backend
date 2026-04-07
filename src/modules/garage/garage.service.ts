import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car } from '../../models/car.schema';
import { Player, PlayerDocument } from '../../models/player.schema';
import { Part } from '../../models/part.schema';

@Injectable()
export class GarageService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Car.name) private carModel: Model<Car>,
    @InjectModel(Part.name) private partModel: Model<Part>,
  ) {}

  //   TODO: Получить список авто друга
  //   async getGarage(playerId: string) {
  //     const player = await this.playerModel.findOne({ userId: playerId }).exec();

  //     if (!player) throw new BadRequestException('Player not found');

  //     const carIds = player.ownedCars.map((owned) => owned.carRef);
  //     const partIds = player.ownedCars.flatMap((owned) =>
  //       owned.parts.map((part) => part.partRef),
  //     );

  //     const [cars, parts] = await Promise.all([
  //       this.carModel
  //         .find({ _id: { $in: carIds } })
  //         .select('name imageUrl')
  //         .lean()
  //         .exec(),
  //       this.partModel
  //         .find({ _id: { $in: partIds } })
  //         .select('name upgradeLevels')
  //         .lean()
  //         .exec(),
  //     ]);

  //     const carMap = new Map(cars.map((car) => [car._id.toString(), car]));
  //     const partMap = new Map(parts.map((part) => [part._id.toString(), part]));

  //     return player.ownedCars.map((owned, index) => {
  //       const car = carMap.get(owned.carRef.toString());
  //       const carParts = owned.parts.map((part) => {
  //         const partData = partMap.get(part.partRef.toString());
  //         const levelData = partData?.upgradeLevels?.find(
  //           (l) => l.level === part.level,
  //         );

  //         return {
  //           partId: part.partRef.toString(),
  //           name: partData?.name ?? 'Неизвестная запчасть',
  //           level: part.level,
  //           powerBoost: levelData?.powerBoost ?? 0,
  //           iconUrl: levelData?.iconUrl ?? '',
  //         };
  //       });

  //       return {
  //         index,
  //         carId: owned.carRef.toString(),
  //         name: car?.name ?? 'Неизвестно',
  //         power: owned.power,
  //         rating: 0,
  //         imageUrl: car?.imageUrl ?? '',
  //         isActive: player.selectedCarId?.toString() === owned.carRef.toString(),
  //         sellPrice: owned.sellPrice,
  //         parts: carParts,
  //       };
  //     });
  //   }

  async sellCar(userId: string, carId: string) {
    const player = await this.playerModel.findOne({ userId }).exec();
    if (!player) {
      throw new BadRequestException('Player not found');
    }

    // нельзя продать единственный автомобиль в гараже
    if (player.ownedCars.length <= 1) {
      throw new BadRequestException('Cannot sell the only car in garage');
    }

    const carIndex = player.ownedCars.findIndex(
      (owned) => owned.carRef.toString() === carId,
    );
    if (carIndex === -1) throw new BadRequestException('Car not owned');

    const ownedCar = player.ownedCars[carIndex];

    player.silver += ownedCar.sellPrice;
    player.stats.earnedMoney += ownedCar.sellPrice;

    player.ownedCars.splice(carIndex, 1);

    // Если продали выбранную машину — сбрасываем выбор
    if (player.selectedCarId?.toString() === carId) {
      player.selectedCarId =
        player.ownedCars.length > 0 ? player.ownedCars[0].carRef : null;
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

  async selectCar(userId: string, carId: string) {
    const player = await this.playerModel.findOne({ userId }).exec();

    if (!player) throw new BadRequestException('Player not found');

    const carExists = player.ownedCars.some(
      (owned) => owned._id.toString() === carId,
    );
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
