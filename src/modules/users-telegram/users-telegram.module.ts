import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTelegram } from 'src/entities/users-telegram.entity';
import { Profile } from 'src/entities/profile.entity';
import { UsersTelegramRepository } from 'src/repositories/users-telegram.repository';
import { ProfileRepository } from 'src/repositories/profile.repository';
import { UsersTelegramController } from './users-telegram.controller';
import { UsersTelegramService } from './users-telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersTelegram, Profile])],
  controllers: [UsersTelegramController],
  providers: [UsersTelegramRepository, ProfileRepository, UsersTelegramService],
  exports: [UsersTelegramService, UsersTelegramRepository],
})
export class UsersTelegramModule {}
