import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('api/player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id/info')
  async getPlayer(@Param('id') id: string) {
    return this.playerService.getPlayer(id);
  }
}
