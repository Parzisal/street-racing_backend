import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RacesService } from './races.service';
import { RacesController } from './races.controller';
import { Player, PlayerSchema } from '../../models/player.schema';
import { Race, RaceSchema } from '../../models/race.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Race.name, schema: RaceSchema },
    ]),
  ],
  controllers: [RacesController],
  providers: [RacesService],
})
export class RacesModule {}
