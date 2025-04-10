import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

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
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
