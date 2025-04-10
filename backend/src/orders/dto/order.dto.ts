import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ example: 'article-id-1' })
  @IsString()
  @IsNotEmpty()
  articleId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'restaurant-id-1' })
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({ example: '123 Delivery St, Paris' })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({ example: 'Credit Card' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.ACCEPTED })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}

export class AssignDeliveryPersonDto {
  @ApiProperty({ example: 'delivery-person-id' })
  @IsString()
  @IsNotEmpty()
  deliveryPersonId: string;
} 