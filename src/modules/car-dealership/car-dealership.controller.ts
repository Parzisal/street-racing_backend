import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { CarDealershipService } from './car-dealership.service';

@Controller('api/car-dealership')
export class CarDealershipController {
  constructor(private readonly service: CarDealershipService) {}

  @Get(':userId/available')
  async getCars(@Param('userId') userId: string) {
    return this.service.getAvailableCars(userId);
  }

  @Post('buy')
  async buy(@Body() body: { userId: string; carId: string }) {
    const userId = body.userId;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    return this.service.buyCar(userId, body.carId);
  }
}
