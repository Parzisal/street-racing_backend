import { BadRequestException, Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FuelService } from './fuel.service';

@Controller('api/fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get(':userId')
  async getFuel(@Param('userId') userId: string) {
    return this.fuelService.getFuel(userId);
  }

  @Post('refill')
  async refill(@Body() body: { userId?: string; playerId?: string }) {
    const userId = body.userId ?? body.playerId;
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.fuelService.refillFuel(userId);
  }

  @Post('increase-max')
  async increaseMax(@Body() body: { userId?: string; playerId?: string }) {
    const userId = body.userId ?? body.playerId;
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.fuelService.increaseMaxFuel(userId);
  }
}
