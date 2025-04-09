import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { RestaurantStatus } from '@prisma/client';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Pizza Palace' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Paris' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 2.99 })
  @IsNumber()
  @IsNotEmpty()
  deliveryFees: number;

  @ApiProperty({ example: 'Authentic Italian pizzas made with fresh ingredients' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: RestaurantStatus, example: RestaurantStatus.ACTIVE, required: false })
  @IsEnum(RestaurantStatus)
  @IsOptional()
  status?: RestaurantStatus;
}

export class UpdateRestaurantDto {
  @ApiProperty({ example: 'Pizza Palace', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Paris', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 2.99, required: false })
  @IsNumber()
  @IsOptional()
  deliveryFees?: number;

  @ApiProperty({ example: 'Authentic Italian pizzas made with fresh ingredients', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: RestaurantStatus, example: RestaurantStatus.INACTIVE, required: false })
  @IsEnum(RestaurantStatus)
  @IsOptional()
  status?: RestaurantStatus;
} 