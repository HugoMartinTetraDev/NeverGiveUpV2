import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant.dto';
import { Restaurant } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async create(createRestaurantDto: CreateRestaurantDto, ownerId?: string): Promise<Restaurant> {
    const data = {
      ...createRestaurantDto,
      ...(ownerId && { ownerId }),
    };

    return this.prisma.restaurant.create({
      data,
    });
  }

  async findAll(): Promise<Restaurant[]> {
    return this.prisma.restaurant.findMany();
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${id}" not found`);
    }

    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    // Check if restaurant exists
    await this.findOne(id);

    return this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
    });
  }

  async remove(id: string): Promise<Restaurant> {
    // Check if restaurant exists
    await this.findOne(id);

    return this.prisma.restaurant.delete({
      where: { id },
    });
  }

  async getStatistics(id: string) {
    // Check if restaurant exists
    await this.findOne(id);

    // Get total orders and revenue
    const orders = await this.prisma.order.findMany({
      where: { restaurantId: id },
      include: {
        orderItems: {
          include: {
            article: true,
          },
        },
      },
    });

    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

    // Get popular items
    const itemCounts = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!itemCounts[item.articleId]) {
          itemCounts[item.articleId] = {
            count: 0,
            article: item.article,
          };
        }
        itemCounts[item.articleId].count += item.quantity;
      });
    });

    const popularItems = Object.values(itemCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5)
      .map((item: any) => item.article);

    return {
      totalOrders,
      revenue,
      averageOrderValue,
      popularItems,
    };
  }
} 