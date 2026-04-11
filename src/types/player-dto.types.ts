interface PlayerStats {
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

interface FuelData {
  current: number;
  max: number;
  lastRefill: Date;
}

interface RecentChallenge {
  challengerId: string;
  raceId: string;
  date: Date;
}
