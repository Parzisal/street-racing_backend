export class CreateSettingsDto {
  id?: number;
  defaultStartLevel?: number;
  defaultExperience?: number;
  defaultSilver?: number;
  defaultGold?: number;
  defaultGarageSlots?: number;
  defaultCarId?: string | null;
}
