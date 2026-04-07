import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { GarageService } from './garage.service';

@Controller('api/garage')
export class GarageController {
  constructor(private readonly garageService: GarageService) {}

  @Post('sell-car')
  async sellCar(@Body() body: { userId: string; carId: string }) {
    return this.garageService.sellCar(body.userId, body.carId);
  }

  @Post('select-car')
  async selectCar(@Body() body: { userId: string; carId: string }) {
    return this.garageService.selectCar(body.userId, body.carId);
  }
}
