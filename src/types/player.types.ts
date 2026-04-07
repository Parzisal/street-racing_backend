import { Types } from 'mongoose';

export type OwnedCarPart = {
  part: Types.ObjectId;
  level: number;
};

export type OwnedCar = {
  car: Types.ObjectId;
  power: number;
  sellPrice: number;
  parts: OwnedCarPart[];
};

export interface PlayerStats {
  totalRaces: number;
  wins: number;
  losses: number;
  spentMoney: number;
  earnedMoney: number;
  racesForLevel: number;
  challengesReceived: number;
}
export type PlayerPartDto = {
  partId: string;
  name: string;
  level: number;
  powerBoost: number;
  iconUrl?: string;
};

export type PlayerCarDto = {
  carId: string;
  name: string;
  //   basePower: number;
  currentPower: number;
  rating: number;
  imageUrl: string;
  thumbnailUrl?: string;
  sellPrice: number;
  parts: PlayerPartDto[];
};

export type PlayerGetDto = {
  userId: string;
  username: string;
  level: number;
  experience: number;
  silver: number;
  gold: number;
  fuel: FuelData;
  garageSlots: number;
  selectedCarId?: string;
  stats: PlayerStats;
  recentChallenges: RecentChallenge[];
  ownedCars: PlayerCarDto[];
};

export interface FuelData {
  current: number;
  max: number;
  lastRefill: Date;
}

export interface RecentChallenge {
  challengerId: string;
  raceId: string;
  date: Date;
}
