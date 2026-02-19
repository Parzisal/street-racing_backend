import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CarDealershipService } from './car-dealership.service';

@Controller('car-dealership')
export class CarDealershipController {
  constructor(private readonly service: CarDealershipService) {}

  @Get(':playerId')
  async getCars(@Param('playerId') playerId: string) {
    return this.service.getAvailableCars(playerId);
  }

  @Post('buy')
  async buy(@Body() body: { playerId: string; carId: string }) {
    return this.service.buyCar(body.playerId, body.carId);
  }
}
