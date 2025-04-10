import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async create(restaurantId: string, createMenuDto: CreateMenuDto) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${restaurantId}" not found`);
    }

    const { itemIds, ...menuData } = createMenuDto;
    
    // Vérifier si les itemIds existent avant de les connecter
    let itemsToConnect: { id: string }[] = [];
    if (itemIds && itemIds.length > 0) {
      // Vérifier que tous les articles existent
      const existingItems = await this.prisma.article.findMany({
        where: {
          id: { in: itemIds },
          restaurantId: restaurantId
        }
      });
      
      if (existingItems.length !== itemIds.length) {
        throw new NotFoundException(`One or more articles not found in restaurant "${restaurantId}"`);
      }
      
      itemsToConnect = itemIds.map(id => ({ id }));
    }
    
    // Create menu
    const menu = await this.prisma.menu.create({
      data: {
        ...menuData,
        restaurant: { connect: { id: restaurantId } },
        ...(itemsToConnect.length > 0 ? {
          items: {
            connect: itemsToConnect,
          },
        } : {}),
      },
      include: {
        items: true,
      },
    });

    return menu;
  }

  async findAll(restaurantId: string) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${restaurantId}" not found`);
    }

    return this.prisma.menu.findMany({
      where: { restaurantId },
      include: {
        items: true,
      },
    });
  }

  async update(restaurantId: string, menuId: string, updateMenuDto: UpdateMenuDto) {
    // Check if menu exists in the given restaurant
    const menu = await this.prisma.menu.findFirst({
      where: {
        id: menuId,
        restaurantId,
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID "${menuId}" not found in restaurant "${restaurantId}"`);
    }

    const { itemIds, ...menuData } = updateMenuDto;

    // Update menu
    return this.prisma.menu.update({
      where: { id: menuId },
      data: {
        ...menuData,
        ...(itemIds && {
          items: {
            set: itemIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        items: true,
      },
    });
  }

  async remove(restaurantId: string, menuId: string) {
    // Check if menu exists in the given restaurant
    const menu = await this.prisma.menu.findFirst({
      where: {
        id: menuId,
        restaurantId,
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID "${menuId}" not found in restaurant "${restaurantId}"`);
    }

    // Delete menu
    return this.prisma.menu.delete({
      where: { id: menuId },
    });
  }
} 