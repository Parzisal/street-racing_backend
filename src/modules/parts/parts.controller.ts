import { Controller, Post, Body, Req } from '@nestjs/common';
import { PartsService } from './parts.service';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post('upgrade')
  async upgradePart(
    @Body() body: { userId: string; carId: string; partId: string },
  ) {
    return this.partsService.upgradePart(body.userId, body.carId, body.partId);
  }
}
