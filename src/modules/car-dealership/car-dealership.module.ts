import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarDealershipService } from './car-dealership.service';
import { CarDealershipController } from './car-dealership.controller';
import { Player, PlayerSchema } from '../../models/player.schema';
import { Car, CarSchema } from '../../models/car.schema';
import { Part, PartSchema } from '../../models/part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Car.name, schema: CarSchema },
      { name: Part.name, schema: PartSchema },
    ]),
  ],
  controllers: [CarDealershipController],
  providers: [CarDealershipService],
})
export class CarDealershipModule {}
