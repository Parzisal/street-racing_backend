import { Types } from 'mongoose';
import type {
  FuelData,
  OwnedCar,
  PlayerStats,
  RecentChallenge,
} from './player.types';

/** ===== Populated refs ===== */

export type PopulatedCar = {
  _id: Types.ObjectId;
  name: string;
  basePower: number;
  imageUrl: string;
  thumbnailUrl?: string;
  rating: number;
};

export type PopulatedPart = {
  _id: Types.ObjectId;
  name: string;
  upgradeLevels: {
    level: number;
    powerBoost: number;
    iconUrl: string;
  }[];
};

/** ===== Owned car (populated) ===== */

export type OwnedCarPopulated = Omit<OwnedCar, 'carRef' | 'parts'> & {
  carRef: PopulatedCar;
  parts: Array<{
    partRef: PopulatedPart;
    level: number;
  }>;
};

/** ===== Player lean ===== */

export type PlayerLean = {
  _id: Types.ObjectId;
  userId: string;
  username: string;
  level: number;
  experience: number;
  silver: number;
  gold: number;
  fuel: FuelData;
  garageSlots: number;
  stats: PlayerStats;
  selectedCarId: Types.ObjectId | null;
  ownedCars: OwnedCarPopulated[];
  recentChallenges: RecentChallenge[];
};
