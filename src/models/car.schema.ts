import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Car extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  carModel: string;

  @Prop({ required: true })
  basePower: number;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  priceSilver: number;

  @Prop({ default: 0 })
  priceGold: number;

  @Prop()
  imageUrl: string;
}

export type CarDto = Pick<
  Car,
  | 'name'
  | 'carModel'
  | 'basePower'
  | 'level'
  | 'priceSilver'
  | 'priceGold'
  | 'imageUrl'
>;
export const CarSchema = SchemaFactory.createForClass(Car);
