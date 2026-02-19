import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import type {
  FuelData,
  PlayerStats,
  RecentChallenge,
} from '../types/player.types';

export type OwnedCarPart = {
  partRef: Types.ObjectId;
  level: number;
};

export type OwnedCar = {
  _id: Types.ObjectId;
  carRef: Types.ObjectId;
  power: number;
  sellPrice: number;
  parts: OwnedCarPart[];
};

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ default: 1, min: 1, max: 10 })
  level: number;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: 5000 })
  silver: number;

  @Prop({ default: 10 })
  gold: number;

  @Prop({
    type: {
      current: { type: Number, default: 100 },
      max: { type: Number, default: 100 },
      lastRefill: { type: Date, default: Date.now },
    },
  })
  fuel: FuelData;

  @Prop({ default: 4 })
  garageSlots: number;

  @Prop({
    type: {
      totalRaces: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      spentMoney: { type: Number, default: 0 },
      earnedMoney: { type: Number, default: 0 },
      racesForLevel: { type: Number, default: 0 },
      challengesReceived: { type: Number, default: 0 },
    },
  })
  stats: PlayerStats;

  @Prop({ type: Types.ObjectId, default: null })
  selectedCarId: Types.ObjectId | null;

  @Prop({
    type: [
      {
        carRef: { type: Types.ObjectId, ref: 'Car' },
        power: Number,
        sellPrice: Number,
        parts: [
          {
            partRef: { type: Types.ObjectId, ref: 'Part' },
            level: { type: Number, default: 0 },
          },
        ],
      },
    ],
    default: [],
  })
  ownedCars: OwnedCar[];

  @Prop({
    type: [{ challengerId: String, raceId: String, date: Date }],
    default: [],
  })
  recentChallenges: RecentChallenge[];
}

export type PlayerDocument = HydratedDocument<Player>;
export const PlayerSchema = SchemaFactory.createForClass(Player);
