import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Race extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Player', required: true })
  player1: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Player', required: true })
  player2: Types.ObjectId;

  @Prop({ required: true })
  player1CarIndex: number;

  @Prop()
  player2CarIndex?: number;

  @Prop()
  winner?: Types.ObjectId;

  @Prop({ default: 'pending' })
  status: 'pending' | 'completed';

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const RaceSchema = SchemaFactory.createForClass(Race);
