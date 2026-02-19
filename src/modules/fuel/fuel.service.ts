import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../../models/player.schema';

@Injectable()
export class FuelService {
  constructor(@InjectModel(Player.name) private playerModel: Model<any>) {}

  private calculateFuel(fuel) {
    const now = Date.now();
    const timePassedMs = now - new Date(fuel.lastRefill).getTime();
    const addedFuel = Math.floor(timePassedMs / (5 * 60 * 1000));

    fuel.current = Math.min(fuel.max, fuel.current + addedFuel);
    fuel.lastRefill = new Date(now - (timePassedMs % (5 * 60 * 1000)));

    return fuel;
  }

  async getFuel(playerId: string) {
    const player = await this.playerModel.findById(playerId);
    if (!player) throw new BadRequestException('Player not found');

    player.fuel = this.calculateFuel(player.fuel);
    await player.save();

    return player.fuel;
  }

  async refillFuel(playerId: string) {
    const player = await this.playerModel.findById(playerId);
    if (!player) throw new BadRequestException('Player not found');

    if (player.gold < 5) throw new BadRequestException('Not enough gold');

    player.gold -= 5;
    player.fuel.current = player.fuel.max;
    player.fuel.lastRefill = new Date();

    await player.save();

    return {
      success: true,
      changes: {
        gold: player.gold,
        fuel: player.fuel,
      },
    };
  }

  async increaseMaxFuel(playerId: string) {
    const player = await this.playerModel.findById(playerId);
    if (!player) throw new BadRequestException('Player not found');

    if (player.gold < 10) throw new BadRequestException('Not enough gold');

    player.gold -= 10;
    player.fuel.max += 50;
    player.fuel.current = Math.min(player.fuel.current, player.fuel.max);

    await player.save();

    return {
      success: true,
      changes: {
        gold: player.gold,
        fuel: player.fuel,
      },
    };
  }
}
