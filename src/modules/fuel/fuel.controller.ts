import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FuelService } from './fuel.service';

@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get(':playerId')
  async getFuel(@Param('playerId') playerId: string) {
    return this.fuelService.getFuel(playerId);
  }

  @Post('refill')
  async refill(@Body() body: { playerId: string }) {
    return this.fuelService.refillFuel(body.playerId);
  }

  @Post('increase-max')
  async increaseMax(@Body() body: { playerId: string }) {
    return this.fuelService.increaseMaxFuel(body.playerId);
  }
}
