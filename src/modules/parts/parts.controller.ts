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
import { PartsService } from './parts.service';
import { CreatePartDto } from './create-part.dto';
import { UpdatePartDto } from './update-part.dto';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() dto: CreatePartDto) {
  //   return this.partsService.create(dto);
  // }

  // @Get()
  // findAll() {
  //   return this.partsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.partsService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: UpdatePartDto,
  // ) {
  //   return this.partsService.update(id, dto);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.partsService.remove(id);
  // }
}
