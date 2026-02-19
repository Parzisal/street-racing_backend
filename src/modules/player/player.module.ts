import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Player, PlayerSchema } from '../../models/player.schema';
import { Car, CarSchema } from 'src/models/car.schema';
import { Part, PartSchema } from 'src/models/part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Car.name, schema: CarSchema },
      { name: Part.name, schema: PartSchema },
    ]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
