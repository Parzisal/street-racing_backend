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

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }
  private static readonly MOCK_JWT_PROFILE_ID =
    '019d8643-1417-70d2-805d-2b2a12d62a09';

  @Post('/create-default')
  @HttpCode(HttpStatus.CREATED)
  create() {
    return this.profilesService.createDefault();
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get('/me')
  getFrontendProfile() {
    // TODO: replace with profile_id from JWT when auth is implemented.
    return this.profilesService.getFrontendProfile(
      ProfilesController.MOCK_JWT_PROFILE_ID,
    );
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
