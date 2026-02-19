import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../../models/player.schema';
import { Race } from '../../models/race.schema';

// Старая завязка на carIndex, можно переделать на selectedCarId
@Injectable()
export class RacesService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<any>,
    @InjectModel(Race.name) private raceModel: Model<any>,
  ) {}

  async sendChallenge(
    fromPlayerId: string,
    toPlayerId: string,
    carIndex: number,
  ) {
    const fromPlayer = await this.playerModel.findById(fromPlayerId);
    const toPlayer = await this.playerModel.findById(toPlayerId);

    if (!fromPlayer || !toPlayer)
      throw new BadRequestException('Player not found');

    // авто‑пополнение топлива у игрока, который отправляет вызов
    fromPlayer.fuel = this.calculateFuel(fromPlayer.fuel);

    // топливо списывается у игрока, который начинает заезд (отправляет вызов)
    if (fromPlayer.fuel.current < 10) {
      throw new BadRequestException('No fuel');
    }
    fromPlayer.fuel.current -= 10;

    // валидация индекса машины
    if (carIndex < 0 || carIndex >= fromPlayer.ownedCars.length) {
      throw new BadRequestException('Invalid car index');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyCount = await this.raceModel.countDocuments({
      player1: fromPlayerId,
      player2: toPlayerId,
      timestamp: { $gte: today },
      status: 'completed',
    });
    if (dailyCount >= 3) throw new BadRequestException('Daily limit reached');

    const race = new this.raceModel({
      player1: fromPlayerId,
      player2: toPlayerId,
      player1CarIndex: carIndex,
      status: 'pending',
      timestamp: new Date(),
    });
    await race.save();

    toPlayer.recentChallenges.push({
      challengerId: fromPlayerId,
      raceId: race._id,
      date: new Date(),
    });
    toPlayer.stats.challengesReceived += 1;

    // храним только последние 10 вызовов
    if (toPlayer.recentChallenges.length > 10) {
      toPlayer.recentChallenges =
        toPlayer.recentChallenges.slice(-10);
    }

    await Promise.all([fromPlayer.save(), toPlayer.save()]);

    return race;
  }

  async acceptChallenge(raceId: string, acceptorId: string, carIndex: number) {
    const race = await this.raceModel.findById(raceId);
    if (
      !race ||
      race.status !== 'pending' ||
      race.player2.toString() !== acceptorId
    )
      throw new BadRequestException('Invalid race');

    const player1 = await this.playerModel.findById(race.player1);
    const player2 = await this.playerModel.findById(race.player2);

    if (!player1 || !player2) {
      throw new BadRequestException('Player not found');
    }

    // авто‑пополнение топлива для обоих игроков
    player1.fuel = this.calculateFuel(player1.fuel);
    player2.fuel = this.calculateFuel(player2.fuel);

    // валидация индексов машин обоих игроков
    if (
      race.player1CarIndex < 0 ||
      race.player1CarIndex >= player1.ownedCars.length
    ) {
      throw new BadRequestException('Invalid player1 car index');
    }
    if (carIndex < 0 || carIndex >= player2.ownedCars.length) {
      throw new BadRequestException('Invalid player2 car index');
    }

    const p1Car = player1.ownedCars[race.player1CarIndex];
    const p2Car = player2.ownedCars[carIndex];

    const p1Score = p1Car.power * (0.9 + Math.random() * 0.2);
    const p2Score = p2Car.power * (0.9 + Math.random() * 0.2);

    const winner = p1Score > p2Score ? player1 : player2;
    const loser =
      winner._id.toString() === player1._id.toString() ? player2 : player1;

    const rewardSilver = Math.floor((p1Car.power + p2Car.power) / 10);
    const rewardExp = 50;

    winner.silver += rewardSilver;
    winner.stats.earnedMoney += rewardSilver;
    winner.experience += rewardExp;
    winner.stats.wins += 1;
    winner.stats.totalRaces += 1;
    winner.stats.racesForLevel += 1;

    loser.stats.losses += 1;
    loser.stats.totalRaces += 1;
    loser.stats.racesForLevel += 1;

    const expThreshold = winner.level * 1000;
    if (winner.experience >= expThreshold && winner.level < 10) {
      winner.level += 1;
      winner.experience -= expThreshold;
      winner.stats.racesForLevel = 0;
    }

    race.player2CarIndex = carIndex;
    race.winner = winner._id;
    race.status = 'completed';

    await Promise.all([player1.save(), player2.save(), race.save()]);

    return {
      success: true,
      winnerId: winner._id.toString(),
      changes: {
        silver: winner.silver,
        experience: winner.experience,
        level: winner.level,
        stats: winner.stats,
      },
    };
  }

  private calculateFuel(fuel) {
    const now = Date.now();
    const timePassed = Math.floor(
      (now - new Date(fuel.lastRefill).getTime()) / 300000,
    );
    fuel.current = Math.min(fuel.max, fuel.current + timePassed);
    fuel.lastRefill = new Date(now - timePassed * 300000);
    return fuel;
  }
}
