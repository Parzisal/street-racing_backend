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
import { ProfileCarsService } from './profile-cars.service';
import { CreateProfileCarDto } from './create-profile-car.dto';
import { UpdateProfileCarDto } from './update-profile-car.dto';

@Controller('profile-cars')
export class ProfileCarsController {
  constructor(private readonly profileCarsService: ProfileCarsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProfileCarDto) {
    return this.profileCarsService.create(dto);
  }

  @Get()
  findAll() {
    return this.profileCarsService.findAll();
  }

  @Get('by-profile/:profileId')
  findByProfile(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.profileCarsService.findByProfileId(profileId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileCarsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileCarDto,
  ) {
    return this.profileCarsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileCarsService.remove(id);
  }
}
