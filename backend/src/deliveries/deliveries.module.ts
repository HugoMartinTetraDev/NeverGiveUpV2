import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [DeliveriesController],
})
export class DeliveriesModule {} 