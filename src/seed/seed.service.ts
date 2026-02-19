import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDto } from '../models/car.schema';
import { Part } from '../models/part.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<Car>,
    @InjectModel(Part.name) private partModel: Model<Part>,
  ) {}

  async seed() {
    if ((await this.carModel.countDocuments()) > 0) {
      return;
    }

    await this.partModel.insertMany([
      // 1️⃣ Шины
      {
        name: 'Шины',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Шины+0',
          },
          {
            level: 1,
            powerBoost: 7,
            costSilver: 12000,
            iconUrl: 'https://placehold.co/100x100/green/white?text=Шины+1',
          },
          {
            level: 2,
            powerBoost: 14,
            costSilver: 25000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Шины+2',
          },
          {
            level: 3,
            powerBoost: 21,
            costSilver: 50000,
            iconUrl: 'https://placehold.co/100x100/purple/white?text=Шины+3',
          },
          {
            level: 4,
            powerBoost: 30,
            costSilver: 100000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Шины+4',
          },
          {
            level: 5,
            powerBoost: 40,
            costSilver: 200000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Шины+5',
          },
        ],
      },
      // 2️⃣ Зажигание
      {
        name: 'Зажигание',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Зажигание+0',
          },
          {
            level: 1,
            powerBoost: 5,
            costSilver: 10000,
            iconUrl:
              'https://placehold.co/100x100/green/white?text=Зажигание+1',
          },
          {
            level: 2,
            powerBoost: 10,
            costSilver: 20000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Зажигание+2',
          },
          {
            level: 3,
            powerBoost: 15,
            costSilver: 40000,
            iconUrl:
              'https://placehold.co/100x100/purple/white?text=Зажигание+3',
          },
          {
            level: 4,
            powerBoost: 22,
            costSilver: 80000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Зажигание+4',
          },
          {
            level: 5,
            powerBoost: 30,
            costSilver: 160000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Зажигание+5',
          },
        ],
      },
      // 3️⃣ Сцепление
      {
        name: 'Сцепление',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Сцепление+0',
          },
          {
            level: 1,
            powerBoost: 6,
            costSilver: 11000,
            iconUrl:
              'https://placehold.co/100x100/green/white?text=Сцепление+1',
          },
          {
            level: 2,
            powerBoost: 12,
            costSilver: 22000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Сцепление+2',
          },
          {
            level: 3,
            powerBoost: 18,
            costSilver: 45000,
            iconUrl:
              'https://placehold.co/100x100/purple/white?text=Сцепление+3',
          },
          {
            level: 4,
            powerBoost: 25,
            costSilver: 90000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Сцепление+4',
          },
          {
            level: 5,
            powerBoost: 35,
            costSilver: 180000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Сцепление+5',
          },
        ],
      },
      // 4️⃣ ЦПУ
      {
        name: 'ЦПУ',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=ЦПУ+0',
          },
          {
            level: 1,
            powerBoost: 4,
            costSilver: 9000,
            iconUrl: 'https://placehold.co/100x100/green/white?text=ЦПУ+1',
          },
          {
            level: 2,
            powerBoost: 8,
            costSilver: 18000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=ЦПУ+2',
          },
          {
            level: 3,
            powerBoost: 12,
            costSilver: 36000,
            iconUrl: 'https://placehold.co/100x100/purple/white?text=ЦПУ+3',
          },
          {
            level: 4,
            powerBoost: 18,
            costSilver: 72000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=ЦПУ+4',
          },
          {
            level: 5,
            powerBoost: 25,
            costSilver: 150000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=ЦПУ+5',
          },
        ],
      },
      // 5️⃣ Закись азота
      {
        name: 'Закись азота',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Закись+0',
          },
          {
            level: 1,
            powerBoost: 8,
            costSilver: 15000,
            iconUrl: 'https://placehold.co/100x100/green/white?text=Закись+1',
          },
          {
            level: 2,
            powerBoost: 16,
            costSilver: 30000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Закись+2',
          },
          {
            level: 3,
            powerBoost: 24,
            costSilver: 60000,
            iconUrl: 'https://placehold.co/100x100/purple/white?text=Закись+3',
          },
          {
            level: 4,
            powerBoost: 32,
            costSilver: 120000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Закись+4',
          },
          {
            level: 5,
            powerBoost: 45,
            costSilver: 240000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Закись+5',
          },
        ],
      },
      // 6️⃣ Выхлоп
      {
        name: 'Выхлоп',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Выхлоп+0',
          },
          {
            level: 1,
            powerBoost: 3,
            costSilver: 8000,
            iconUrl: 'https://placehold.co/100x100/green/white?text=Выхлоп+1',
          },
          {
            level: 2,
            powerBoost: 6,
            costSilver: 16000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Выхлоп+2',
          },
          {
            level: 3,
            powerBoost: 9,
            costSilver: 32000,
            iconUrl: 'https://placehold.co/100x100/purple/white?text=Выхлоп+3',
          },
          {
            level: 4,
            powerBoost: 14,
            costSilver: 64000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Выхлоп+4',
          },
          {
            level: 5,
            powerBoost: 20,
            costSilver: 120000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Выхлоп+5',
          },
        ],
      },
      // 7️⃣ Подвеска
      {
        name: 'Подвеска',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Подвеска+0',
          },
          {
            level: 1,
            powerBoost: 5,
            costSilver: 10000,
            iconUrl: 'https://placehold.co/100x100/green/white?text=Подвеска+1',
          },
          {
            level: 2,
            powerBoost: 10,
            costSilver: 20000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Подвеска+2',
          },
          {
            level: 3,
            powerBoost: 15,
            costSilver: 40000,
            iconUrl:
              'https://placehold.co/100x100/purple/white?text=Подвеска+3',
          },
          {
            level: 4,
            powerBoost: 22,
            costSilver: 80000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Подвеска+4',
          },
          {
            level: 5,
            powerBoost: 30,
            costSilver: 160000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Подвеска+5',
          },
        ],
      },
      // 8️⃣ Наддув
      {
        name: 'Наддув',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Наддув+0',
          },
          {
            level: 1,
            powerBoost: 7,
            costSilver: 12000,
            iconUrl: 'https://placehold.co/100x100/green/white?text=Наддув+1',
          },
          {
            level: 2,
            powerBoost: 14,
            costSilver: 25000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Наддув+2',
          },
          {
            level: 3,
            powerBoost: 21,
            costSilver: 50000,
            iconUrl: 'https://placehold.co/100x100/purple/white?text=Наддув+3',
          },
          {
            level: 4,
            powerBoost: 30,
            costSilver: 100000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Наддув+4',
          },
          {
            level: 5,
            powerBoost: 40,
            costSilver: 200000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Наддув+5',
          },
        ],
      },
      // 9️⃣ Впуск
      {
        name: 'Впуск',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Впуск+0',
          },
          {
            level: 1,
            powerBoost: 4,
            costSilver: 9000,
            iconUrl: 'https://placehold.co/100x100/green/white?text=Впуск+1',
          },
          {
            level: 2,
            powerBoost: 8,
            costSilver: 18000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Впуск+2',
          },
          {
            level: 3,
            powerBoost: 12,
            costSilver: 36000,
            iconUrl: 'https://placehold.co/100x100/purple/white?text=Впуск+3',
          },
          {
            level: 4,
            powerBoost: 18,
            costSilver: 72000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Впуск+4',
          },
          {
            level: 5,
            powerBoost: 25,
            costSilver: 150000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Впуск+5',
          },
        ],
      },
      // 🔟 Радиатор
      {
        name: 'Радиатор',
        upgradeLevels: [
          {
            level: 0,
            powerBoost: 0,
            costSilver: 0,
            iconUrl: 'https://placehold.co/100x100/gray/white?text=Радиатор+0',
          },
          {
            level: 1,
            powerBoost: 3,
            costSilver: 7000,
            iconUrl: 'https://placehold.co/100x100/green/white?text=Радиатор+1',
          },
          {
            level: 2,
            powerBoost: 6,
            costSilver: 14000,
            iconUrl: 'https://placehold.co/100x100/blue/white?text=Радиатор+2',
          },
          {
            level: 3,
            powerBoost: 9,
            costSilver: 28000,
            iconUrl:
              'https://placehold.co/100x100/purple/white?text=Радиатор+3',
          },
          {
            level: 4,
            powerBoost: 14,
            costSilver: 56000,
            iconUrl: 'https://placehold.co/100x100/gold/white?text=Радиатор+4',
          },
          {
            level: 5,
            powerBoost: 20,
            costSilver: 120000,
            iconUrl: 'https://placehold.co/100x100/red/white?text=Радиатор+5',
          },
        ],
      },
    ]);

    const mockCar: CarDto[] = [
      {
        name: 'ZAZ',
        carModel: '965',
        basePower: 27,
        priceSilver: 1000,
        priceGold: 0,
        level: 1,
        imageUrl: 'https://placehold.co/400x200?text=ZAZ+965',
      },
      {
        name: 'Porsche 911',
        carModel: 'GT2 RS',
        basePower: 831,
        priceSilver: 410166,
        priceGold: 0,
        level: 1,
        imageUrl: 'https://placehold.co/400x200?text=Porsche+911+GT2+RS',
      },
      {
        name: 'Lamborghini Gallardo ',
        carModel: 'LP',
        basePower: 924,
        priceSilver: 1237494,
        priceGold: 0,
        level: 2,
        imageUrl: 'https://placehold.co/400x200?text=Lamborghini+Gallardo',
      },
      {
        name: 'Dodge Challenger ',
        carModel: 'R/T',
        basePower: 699,
        priceSilver: 500000,
        priceGold: 50,
        level: 2,
        imageUrl: 'https://placehold.co/400x200?text=Dodge+Challenger',
      },
      // Добавь остальные машины из скринов
    ];
    await this.carModel.insertMany(mockCar);

    console.log('Seed completed');
  }
}
