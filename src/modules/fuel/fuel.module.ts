import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import { Player, PlayerSchema } from '../../models/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  controllers: [FuelController],
  providers: [FuelService],
})
export class FuelModule {}
