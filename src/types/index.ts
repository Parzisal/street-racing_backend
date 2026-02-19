import { Types } from 'mongoose';

export type MongoId = string | Types.ObjectId;

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}
