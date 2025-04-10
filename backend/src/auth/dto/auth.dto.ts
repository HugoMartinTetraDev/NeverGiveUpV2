import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum, IsString, IsOptional, IsDateString, IsArray } from 'class-validator';
import { Role } from '@prisma/client';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+33612345678', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ type: [String], enum: Role, example: [Role.CLIENT] })
  @IsEnum(Role, { each: true })
  @IsArray()
  @IsNotEmpty()
  roles: Role[];

  @ApiProperty({ example: '12345678900012', required: false })
  @IsString()
  @IsOptional()
  siret?: string;

  @ApiProperty({ example: 'FR76XXXXXXXXXXXXX', required: false })
  @IsString()
  @IsOptional()
  iban?: string;
}

export class AuthResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: any;
} 