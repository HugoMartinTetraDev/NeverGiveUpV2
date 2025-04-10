import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, Role } from '../common/enums';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemConfig() {
    const config = await this.prisma.config.findMany();
    return config.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }

  async updateSystemConfig(key: string, value: string) {
    // Upsert the config (update if exists, create if not)
    return this.prisma.config.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getSystemStats() {
    const [
      totalUsers,
      totalClients,
      totalRestaurateurs,
      totalLivreurs,
      totalRestaurants,
      totalOrders,
      totalDeliveredOrders,
      totalCanceledOrders,
      recentOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ 
        where: { 
          userRoles: { 
            some: { 
              role: Role.CLIENT 
            } 
          } 
        } 
      }),
      this.prisma.user.count({ 
        where: { 
          userRoles: { 
            some: { 
              role: Role.RESTAURATEUR 
            } 
          } 
        } 
      }),
      this.prisma.user.count({ 
        where: { 
          userRoles: { 
            some: { 
              role: Role.LIVREUR 
            } 
          } 
        } 
      }),
      this.prisma.restaurant.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELED } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          restaurant: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        clients: totalClients,
        restaurateurs: totalRestaurateurs,
        livreurs: totalLivreurs,
      },
      restaurants: {
        total: totalRestaurants,
      },
      orders: {
        total: totalOrders,
        delivered: totalDeliveredOrders,
        canceled: totalCanceledOrders,
        recentOrders,
      },
    };
  }
} 