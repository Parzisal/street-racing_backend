import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersTelegramService } from './users-telegram.service';
import { CreateUsersTelegramDto } from './create-users-telegram.dto';
import { UpdateUsersTelegramDto } from './update-users-telegram.dto';

@Controller('users-telegram')
export class UsersTelegramController {
  constructor(private readonly usersTelegramService: UsersTelegramService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUsersTelegramDto) {
    return this.usersTelegramService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersTelegramService.findAll();
  }

  @Get('by-profile/:profileId')
  findByProfile(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.usersTelegramService.findByProfileId(profileId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersTelegramService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUsersTelegramDto,
  ) {
    return this.usersTelegramService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersTelegramService.remove(id);
  }
}
