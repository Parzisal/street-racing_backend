import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { GarageService } from './garage.service';

@Controller('garage')
export class GarageController {
  constructor(private readonly garageService: GarageService) {}

  @Get(':playerId')
  async getGarage(@Param('playerId') playerId: string) {
    return this.garageService.getGarage(playerId);
  }

  @Post('sell')
  async sellCar(@Req() req: any, @Body() body: { carId: string }) {
    return this.garageService.sellCar(req.user.id, body.carId);
  }

  @Post('select')
  async selectCar(@Req() req: any, @Body() body: { carId: string }) {
    return this.garageService.selectCar(req.user.id, body.carId);
  }
}
