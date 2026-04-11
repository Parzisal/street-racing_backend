import { Car } from '../models/car.schema';

export type CarsDealershipListGetDto = Pick<
  Car,
  | 'name'
  | 'carModel'
  | 'basePower'
  | 'level'
  | 'priceSilver'
  | 'priceGold'
  | 'imageUrl'
> & { carId: string };
