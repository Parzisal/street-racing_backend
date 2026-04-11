import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { PartsService } from './parts.service';

@Controller('api/parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post('upgrade')
  async upgradePart(
    @Body() body: { userId: string; carId: string; partId: string },
  ) {
    return this.partsService.upgradePart(body.userId, body.carId, body.partId);
  }

  @Get('list')
  async listParts() {
    return this.partsService.list();
  }
}
