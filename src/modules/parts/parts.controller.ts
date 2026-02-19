import { Controller, Post, Body, Req } from '@nestjs/common';
import { PartsService } from './parts.service';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post('upgrade')
  async upgradePart(
    @Req() req: any,
    @Body() body: { carId: string; partId: string },
  ) {
    return this.partsService.upgradePart(req.user.id, body.carId, body.partId);
  }
}
