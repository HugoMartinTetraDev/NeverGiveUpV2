import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MenusModule } from './menus/menus.module';
import { ArticlesModule } from './articles/articles.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    RestaurantsModule,
    MenusModule,
    ArticlesModule,
    OrdersModule,
    DeliveriesModule,
    UsersModule,
    HealthModule,
    AdminModule,
  ],
})
export class AppModule {}
