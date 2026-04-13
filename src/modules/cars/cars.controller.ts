// src/cars/cars.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './create-car.dto';
import { UpdateCarDto } from './update-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() createCarDto: CreateCarDto) {
  //   return this.carsService.create(createCarDto);
  // }

  // @Get()
  // findAll() {
  //   return this.carsService.findAll();
  // }

  // @Get('paginated')
  // findPaginated(
  //   @Query('page') page?: string,
  //   @Query('limit') limit?: string,
  // ) {
  //   return this.carsService.findAllPaginated(
  //     page ? parseInt(page) : 1,
  //     limit ? parseInt(limit) : 10,
  //   );
  // }

  // @Get('stats')
  // getStats() {
  //   return this.carsService.getStats();
  // }

  // @Get('search')
  // search(@Query() query: any) {
  //   return this.carsService.findAdvanced({
  //     minPower: query.minPower ? parseInt(query.minPower) : undefined,
  //     maxPrice: query.maxPrice ? parseInt(query.maxPrice) : undefined,
  //     minRating: query.minRating ? parseInt(query.minRating) : undefined,
  //     model: query.model,
  //   });
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.carsService.findOne(id);
  // }

  // @Get('model/:model')
  // findByModel(@Param('model') model: string) {
  //   return this.carsService.findByModel(model);
  // }

  // @Get('price-range/:min/:max')
  // findByPriceRange(
  //   @Param('min') min: string,
  //   @Param('max') max: string,
  // ) {
  //   return this.carsService.findByPriceRange(parseInt(min), parseInt(max));
  // }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateCarDto: UpdateCarDto,
  // ) {
  //   return this.carsService.update(id, updateCarDto);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.carsService.remove(id);
  // }
}
