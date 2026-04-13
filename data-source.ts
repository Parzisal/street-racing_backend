import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Car } from './src/entities/car.entity';
import { Part } from './src/entities/part.entity';
import { Profile } from './src/entities/profile.entity';
import { ProfileCar } from './src/entities/profile-car.entity';
import { ProfileCarPart } from './src/entities/profile-car-part.entity';
import { UsersTelegram } from './src/entities/users-telegram.entity';
import { Settings } from './src/entities/settings.entity';

// TODO: получать данные из .env
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: "1111",
  database: "ds",
  entities: [
    Car,
    Part,
    Profile,
    ProfileCar,
    ProfileCarPart,
    UsersTelegram,
    Settings,
  ],
  migrations: [
    join(
      __dirname,
      'src',
      'migrations',
      __filename.endsWith('.js') ? '*.js' : '*.ts',
    ),
  ],
  synchronize: false,
  logging: true,
});