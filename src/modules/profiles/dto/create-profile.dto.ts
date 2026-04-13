export class CreateProfileDto {
  level: number;
  experience: number;
  silver: number;
  gold: number;
  garageSlots: number;
  selectedCarId?: string | null;
}
