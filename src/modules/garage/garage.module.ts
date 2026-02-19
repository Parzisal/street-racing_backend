import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GarageService } from './garage.service';
import { GarageController } from './garage.controller';
import { Player, PlayerSchema } from '../../models/player.schema';
import { Part, PartSchema } from '../../models/part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Part.name, schema: PartSchema },
    ]),
  ],
  controllers: [GarageController],
  providers: [GarageService],
})
export class GarageModule {}
