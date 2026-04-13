import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTelegram } from '@entities/users-telegram.entity';
import { Profile } from '@entities/profile.entity';
import { UsersTelegramRepository } from '@repositories/users-telegram.repository';
import { ProfileRepository } from '@repositories/profile.repository';
import { UsersTelegramController } from './users-telegram.controller';
import { UsersTelegramService } from './users-telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersTelegram, Profile])],
  controllers: [UsersTelegramController],
  providers: [UsersTelegramRepository, ProfileRepository, UsersTelegramService],
  exports: [UsersTelegramService, UsersTelegramRepository],
})
export class UsersTelegramModule {}
