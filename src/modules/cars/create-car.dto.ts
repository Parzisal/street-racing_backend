// src/cars/dto/create-car.dto.ts
// import { IsString, IsInt, Min, Max, IsUUID, IsOptional } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger'; // если используете swagger

export class CreateCarDto {
//   @ApiProperty({ example: 'Ferrari', description: 'Название автомобиля' })
//   @IsString()
  name: string;

//   @ApiProperty({ example: 'F8 Tributo', description: 'Модель автомобиля' })
//   @IsString()
  model: string;

//   @ApiProperty({ example: 720, description: 'Базовая мощность в л.с.' })
//   @IsInt()
//   @Min(0)
  basePower: number;

//   @ApiProperty({ example: 85, description: 'Базовый рейтинг' })
//   @IsInt()
//   @Min(0)
//   @Max(100)
  baseRating: number;

//   @ApiProperty({ example: 10, description: 'Уровень покупки' })
//   @IsInt()
//   @Min(1)
  buyLevel: number;

//   @ApiProperty({ example: 50000, description: 'Цена за серебро' })
//   @IsInt()
//   @Min(0)
  priceSilver: number;

//   @ApiProperty({ example: 500, description: 'Цена за золото' })
//   @IsInt()
//   @Min(0)
  priceGold: number;

//   @ApiProperty({ example: 'https://example.com/ferrari.jpg', description: 'URL изображения' })
//   @IsString()
  imageUrl: string;
}