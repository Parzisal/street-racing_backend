import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from './modules/player/player.module';
import { CarDealershipModule } from './modules/car-dealership/car-dealership.module';
import { GarageModule } from './modules/garage/garage.module';
import { RacesModule } from './modules/races/races.module';
import { FuelModule } from './modules/fuel/fuel.module';
import { SeedService } from './seed/seed.service';
import { Player, PlayerSchema } from './models/player.schema';
import { Car, CarSchema } from './models/car.schema';
import { Part, PartSchema } from './models/part.schema';
import { Race, RaceSchema } from './models/race.schema';
import { PartsModule } from './modules/parts/parts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/street-racer',
    ),
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Car.name, schema: CarSchema },
      { name: Part.name, schema: PartSchema },
      { name: Race.name, schema: RaceSchema },
    ]),
    PlayerModule,
    CarDealershipModule,
    GarageModule,
    // RacesModule,
    // FuelModule,
    // PartsModule,
  ],
  providers: [SeedService],
})
export class AppModule {
  constructor(private seedService: SeedService) {
    this.seedService.seed().catch(console.error);
  }
}
