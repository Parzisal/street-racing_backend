import { Controller, Post, Body } from '@nestjs/common';
import { RacesService } from './races.service';

@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Post('challenge')
  async sendChallenge(
    @Body()
    body: {
      fromPlayerId: string;
      toPlayerId: string;
      carIndex: number;
    },
  ) {
    return this.racesService.sendChallenge(
      body.fromPlayerId,
      body.toPlayerId,
      body.carIndex,
    );
  }

  @Post('accept')
  async acceptChallenge(
    @Body() body: { raceId: string; acceptorId: string; carIndex: number },
  ) {
    return this.racesService.acceptChallenge(
      body.raceId,
      body.acceptorId,
      body.carIndex,
    );
  }
}
