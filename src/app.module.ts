import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Part } from './entities/part.entity';
import { Profile } from './entities/profile.entity';
import { ProfileCar } from './entities/profile-car.entity';
import { ProfileCarPart } from './entities/profile-car-part.entity';
import { UsersTelegram } from './entities/users-telegram.entity';
import { Settings } from './entities/settings.entity';
import { CarsModule } from './modules/cars/cars.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ProfileCarsModule } from './modules/profile-cars/profile-cars.module';
import { PartsModule } from './modules/parts/parts.module';
import { ProfileCarPartsModule } from './modules/profile-car-parts/profile-car-parts.module';
import { UsersTelegramModule } from './modules/users-telegram/users-telegram.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
     TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT!) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'your_database',
      entities: [
        Car,
        Part,
        Profile,
        ProfileCar,
        ProfileCarPart,
        UsersTelegram,
        Settings,
      ],
      synchronize: false, // false в production, т.к. таблица уже существует
      logging: true, // полезно для отладки - видит все SQL запросы
    }),
    // MongooseModule.forRoot(
    //   process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/street-racer',
    // ),
    // MongooseModule.forFeature([
    //   { name: Player.name, schema: PlayerSchema },
    //   // { name: Car.name, schema: CarSchema },
    //   { name: Part.name, schema: PartSchema },
    //   { name: Race.name, schema: RaceSchema },
    // ]),
    CarsModule,
    ProfilesModule,
    ProfileCarsModule,
    PartsModule,
    ProfileCarPartsModule,
    UsersTelegramModule,
    SettingsModule,
    // PlayerModule,
    // CarDealershipModule,
    // GarageModule,
    // RacesModule,
    // FuelModule,
    // PartsModule,
  ],
  providers: [],
})
export class AppModule {}
