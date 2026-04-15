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
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './update-profile.dto';
import { BuyCarDto } from './dto/buy-car.dto';
import { SelectCarDto } from './dto/select-car.dto';
import { SellCarDto } from './dto/sell-car.dto';
import { ApiTags } from '@nestjs/swagger';

const PROFILES_FRONTEND_TAG = 'Profiles - Frontend';
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  private static readonly MOCK_JWT_PROFILE_ID =
    '019d8643-1417-70d2-805d-2b2a12d62a09';

  @Post('/create-default')
  @HttpCode(HttpStatus.CREATED)
  create() {
    return this.profilesService.createDefault();
  }

  @ApiTags(PROFILES_FRONTEND_TAG)
  @Get('/me')
  getMyProfile() {
    // TODO: replace with profile_id from JWT when auth is implemented.
    return this.profilesService.getMyProfile(
      ProfilesController.MOCK_JWT_PROFILE_ID,
    );
  }

  @ApiTags(PROFILES_FRONTEND_TAG)
  @Get('/me/dealership/cars')
  getDealershipCars() {
    return this.profilesService.getAvailableDealershipCars(
      ProfilesController.MOCK_JWT_PROFILE_ID,
    );
  }

  @ApiTags(PROFILES_FRONTEND_TAG)
  @Post('/me/dealership/buy')
  buyDealershipCar(@Body() dto: BuyCarDto) {
    return this.profilesService.buyDealershipCar(
      ProfilesController.MOCK_JWT_PROFILE_ID,
      dto.carId,
    );
  }

  @ApiTags(PROFILES_FRONTEND_TAG)
  @Patch('/me/garage/selected-car')
  selectCurrentCar(@Body() dto: SelectCarDto) {
    return this.profilesService.selectCurrentCar(
      ProfilesController.MOCK_JWT_PROFILE_ID,
      dto.profileCarId,
    );
  }

  @ApiTags(PROFILES_FRONTEND_TAG)
  @Post('/me/garage/sell')
  sellGarageCar(@Body() dto: SellCarDto) {
    return this.profilesService.sellGarageCar(
      ProfilesController.MOCK_JWT_PROFILE_ID,
      dto.profileCarId,
    );
  }

  // Internal controllers
  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.profilesService.remove(id);
  }
}
