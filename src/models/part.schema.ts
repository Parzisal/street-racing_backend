import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Part extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Array, required: true })
  upgradeLevels: UpgradeLevels[];
}

export type UpgradeLevels = {
  level: number;
  powerBoost: number;
  costSilver: number;
  stars: number;
  iconUrl: string;
};
export const PartSchema = SchemaFactory.createForClass(Part);
