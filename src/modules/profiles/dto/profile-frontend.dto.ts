export class FrontendCarDto {
  id: string;
  name: string;
  model: string;
  basePower: number;
  baseRating: number;
  buyLevel: number;
  priceSilver: number;
  priceGold: number;
  imageUrl: string;
}

export class FrontendPartDto {
  id: string;
  name: string;
  level: number;
  powerBoost: number;
  priceSilver: number;
  imageUrl: string;
}

export class FrontendGarageCarDto {
  profileCarId: string;
  car: FrontendCarDto;
  parts: FrontendPartDto[];
}

export class FrontendProfileDto {
  level: number;
  experience: number;
  silver: number;
  gold: number;
  garageSlots: number;
  selectedCarId: string | null;
  garage: FrontendGarageCarDto[];
}
