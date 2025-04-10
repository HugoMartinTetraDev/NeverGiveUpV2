import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class NotificationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'ORDER_STATUS' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'order_status_update' })
  @IsString()
  @IsNotEmpty()
  template: string;

  @ApiProperty({ example: { orderId: 'xyz', status: 'DELIVERED' } })
  content: Record<string, any>;

  @ApiProperty({ example: '2023-01-01T12:00:00.000Z' })
  sentAt: Date;

  @ApiProperty({ example: false })
  isRead: boolean;
}

export class MarkNotificationAsReadDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
} 