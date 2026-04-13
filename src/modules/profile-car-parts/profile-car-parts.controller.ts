import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ProfileCarPartsService } from './profile-car-parts.service';
import { CreateProfileCarPartDto } from './create-profile-car-part.dto';

@Controller('profile-car-parts')
export class ProfileCarPartsController {
  constructor(
    private readonly profileCarPartsService: ProfileCarPartsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProfileCarPartDto) {
    return this.profileCarPartsService.create(dto);
  }

  @Get()
  findAll() {
    return this.profileCarPartsService.findAll();
  }

  @Get('by-profile-car/:profileCarId')
  findByProfileCar(@Param('profileCarId', ParseUUIDPipe) profileCarId: string) {
    return this.profileCarPartsService.findByProfileCarId(profileCarId);
  }

  @Get(':profileCarId/:partId')
  findOne(
    @Param('profileCarId', ParseUUIDPipe) profileCarId: string,
    @Param('partId', ParseUUIDPipe) partId: string,
  ) {
    return this.profileCarPartsService.findOne(profileCarId, partId);
  }

  @Delete(':profileCarId/:partId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('profileCarId', ParseUUIDPipe) profileCarId: string,
    @Param('partId', ParseUUIDPipe) partId: string,
  ) {
    return this.profileCarPartsService.remove(profileCarId, partId);
  }
}
