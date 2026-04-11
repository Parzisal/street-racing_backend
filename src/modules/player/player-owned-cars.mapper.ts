import { Types } from 'mongoose';
import type { PlayerCarDto } from '../../types/player-dto.types';
import { OwnedCar } from '../../models/player.schema';

type CarLike = {
  _id: Types.ObjectId;
  name: string;
  imageUrl?: string;
};

type PartLike = {
  _id: Types.ObjectId;
  name: string;
  upgradeLevels?: Array<{
    level: number;
    powerBoost: number;
    iconUrl?: string;
  }>;
};

export const mapOwnedCarsToDto = (
  ownedCars: OwnedCar[],
  cars: CarLike[],
  parts: PartLike[],
): PlayerCarDto[] => {
  const carMap = new Map(cars.map((car) => [car._id.toString(), car]));
  const partMap = new Map(parts.map((part) => [part._id.toString(), part]));

  return ownedCars.map((ownedCar) => {
    const car = carMap.get(ownedCar.carRef.toString());

    const mappedParts = ownedCar.parts.map((ownedPart) => {
      const part = partMap.get(ownedPart.partRef.toString());
      const levelData = part?.upgradeLevels?.find(
        (level) => level.level === ownedPart.level,
      );

      return {
        partId: ownedPart._id.toString(),
        name: part?.name ?? 'Unknown part',
        level: ownedPart.level,
        powerBoost: levelData?.powerBoost ?? 0,
        iconUrl: levelData?.iconUrl,
      };
    });

    const totalPowerBoost = mappedParts.reduce(
      (sum, part) => sum + part.powerBoost,
      0,
    );

    return {
      carId: ownedCar._id.toString(),
      name: car?.name ?? 'Unknown car',
      currentPower: ownedCar.power + totalPowerBoost,
      rating: 4,
      imageUrl: car?.imageUrl ?? '',
      sellPrice: ownedCar.sellPrice,
      parts: mappedParts,
    };
  });
};
