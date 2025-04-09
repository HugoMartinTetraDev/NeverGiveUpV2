import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Margherita Pizza' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Traditional pizza with tomato sauce, mozzarella, and basil' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'pizza' })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UpdateArticleDto {
  @ApiProperty({ example: 'Super Margherita Pizza', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Deluxe traditional pizza with tomato sauce, buffalo mozzarella, and fresh basil', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 11.99, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'specialty_pizza', required: false })
  @IsString()
  @IsOptional()
  type?: string;
} 