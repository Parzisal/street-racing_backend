import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingsDto } from './create-settings.dto';
import { UpdateSettingsDto } from './update-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateSettingsDto) {
    return this.settingsService.create(dto);
  }

  @Get()
  findOne() {
    return this.settingsService.findOne(1);
  }

  @Patch()
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(1, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove() {
    return this.settingsService.remove(1);
  }
}
