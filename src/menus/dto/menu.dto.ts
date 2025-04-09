import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Family Pack' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Perfect for 4 people: 2 large pizzas, 4 drinks, and 2 desserts' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: ['article-id-1', 'article-id-2'], required: false })
  @IsArray()
  @IsOptional()
  itemIds?: string[];
}

export class UpdateMenuDto {
  @ApiProperty({ example: 'Super Family Pack', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Perfect for 6 people: 3 large pizzas, 6 drinks, and 3 desserts', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 39.99, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: ['article-id-1', 'article-id-2'], required: false })
  @IsArray()
  @IsOptional()
  itemIds?: string[];
} 