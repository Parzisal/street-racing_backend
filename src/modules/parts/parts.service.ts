import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../../models/player.schema';
import { Part } from '../../models/part.schema';
import { PartsListGetDto } from 'src/types/parts-dto.types';

@Injectable()
export class PartsService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(Part.name) private partModel: Model<Part>,
  ) {}

  /**
   * Улучшение запчасти на конкретной машине игрока
   * @param userId ID пользователя
   * @param carId ID машины (ObjectId)
   * @param partId ID запчасти (ObjectId)
   */
  async upgradePart(userId: string, carId: string, partId: string) {
    // const player = await this.playerModel.findOne({ userId }).exec();
    // if (!player) throw new BadRequestException('Игрок не найден');
    // // Находим машину по carId
    // const ownedCar = player.ownedCars.find(
    //   (oc: any) => oc.car.toString() === carId,
    // );
    // if (!ownedCar) throw new BadRequestException('Машина не найдена в гараже');
    // // Находим запчасть в машине
    // const partEntry = ownedCar.parts.find(
    //   (p: any) => p.part.toString() === partId,
    // );
    // if (!partEntry)
    //   throw new BadRequestException('Запчасть не найдена на этой машине');
    // const partTemplate = await this.partModel.findById(partId);
    // if (!partTemplate)
    //   throw new BadRequestException('Шаблон запчасти не найден');
    // const currentLevel = partEntry.level;
    // if (currentLevel >= partTemplate.levels.length - 1) {
    //   throw new BadRequestException('Запчасть уже на максимальном уровне');
    // }
    // const nextLevel = partTemplate.levels[currentLevel + 1];
    // if (player.silver < nextLevel.costSilver) {
    //   throw new BadRequestException(
    //     `Недостаточно серебра. Нужно ${nextLevel.costSilver}, есть ${player.silver}`,
    //   );
    // }
    // // Списание денег и обновление статистики
    // player.silver -= nextLevel.costSilver;
    // player.stats.spentMoney += nextLevel.costSilver;
    // // Улучшаем запчасть
    // partEntry.level = currentLevel + 1;
    // // Увеличиваем мощность машины
    // ownedCar.power += nextLevel.powerBoost;
    // await player.save();
    // const updatedPart = {
    //   partId,
    //   name: partTemplate.name,
    //   level: partEntry.level,
    //   powerBoost: nextLevel.powerBoost,
    //   iconUrl: nextLevel.iconUrl || partTemplate.defaultIconUrl,
    // };
    // return {
    //   success: true,
    //   changes: {
    //     silver: player.silver,
    //     stats: { spentMoney: player.stats.spentMoney },
    //     carId,
    //     updatedPower: ownedCar.power,
    //     updatedPart,
    //   },
    // };
  }

  async list(): Promise<PartsListGetDto[]> {
    const parts = await this.partModel.find().lean();

    const mappedToDto: PartsListGetDto[] = parts.map((part) => {
      return {
        id: part._id.toString(),
        name: part.name,
        upgradeLevels: part.upgradeLevels,
      };
    });

    return mappedToDto;
  }
}
