import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, AssignDeliveryPersonDto } from './dto/order.dto';
import { OrderStatus, Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: createOrderDto.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${createOrderDto.restaurantId}" not found`);
    }

    // Calculate order items and verify they exist
    const orderItems = await Promise.all(
      createOrderDto.items.map(async (item) => {
        const article = await this.prisma.article.findFirst({
          where: {
            id: item.articleId,
            restaurantId: createOrderDto.restaurantId,
          },
        });

        if (!article) {
          throw new NotFoundException(`Article with ID "${item.articleId}" not found in restaurant "${createOrderDto.restaurantId}"`);
        }

        return {
          article,
          quantity: item.quantity,
        };
      })
    );

    // Calculate total amount
    const itemsTotal = orderItems.reduce(
      (total, item) => total + item.article.price * item.quantity,
      0
    );

    const deliveryFees = restaurant.deliveryFees;
    const serviceFees = itemsTotal * 0.1; // 10% service fee
    const totalAmount = itemsTotal + deliveryFees + serviceFees;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: createOrderDto.restaurantId,
        deliveryAddress: createOrderDto.deliveryAddress,
        totalAmount,
        deliveryFees,
        serviceFees,
        paymentMethod: createOrderDto.paymentMethod,
        status: OrderStatus.PENDING,
        timestamps: {
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        },
        orderItems: {
          create: orderItems.map((item) => ({
            articleId: item.article.id,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            article: true,
          },
        },
        restaurant: true,
      },
    });

    return order;
  }

  async findAll(userId: string, role: Role) {
    let where = {};

    // Filter orders based on role
    if (role === Role.CLIENT) {
      where = { userId };
    } else if (role === Role.RESTAURATEUR) {
      // Get restaurant owned by this user
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { ownerId: userId },
      });

      if (!restaurant) {
        return [];
      }

      where = { restaurantId: restaurant.id };
    } else if (role === Role.LIVREUR) {
      where = { deliveryPersonId: userId };
    }
    // For ADMIN, no filter is needed

    return this.prisma.order.findMany({
      where,
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        orderItems: {
          include: {
            article: true,
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        orderItems: {
          include: {
            article: true,
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, userId: string, role: Role) {
    const order = await this.findOne(id);

    // Validate permission to update status
    if (role === Role.CLIENT && order.userId !== userId) {
      throw new BadRequestException('Not authorized to update this order');
    }

    if (role === Role.RESTAURATEUR) {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { ownerId: userId },
      });

      if (!restaurant || order.restaurantId !== restaurant.id) {
        throw new BadRequestException('Not authorized to update this order');
      }
    }

    if (role === Role.LIVREUR && order.deliveryPersonId !== userId) {
      throw new BadRequestException('Not authorized to update this order');
    }

    // Validate status transition
    this.validateStatusTransition(order.status, updateOrderStatusDto.status, role);

    // Update timestamps - traiter le JSON correctement
    const timestamps = order.timestamps as Record<string, any>;
    timestamps[updateOrderStatusDto.status.toLowerCase()] = new Date().toISOString();

    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
        timestamps,
      },
      include: {
        orderItems: {
          include: {
            article: true,
          },
        },
        restaurant: true,
      },
    });
  }

  async assignDeliveryPerson(id: string, assignDto: AssignDeliveryPersonDto) {
    const order = await this.findOne(id);

    // Check if delivery person exists and is a LIVREUR
    const deliveryPerson = await this.prisma.user.findFirst({
      where: {
        id: assignDto.deliveryPersonId,
        role: Role.LIVREUR,
      },
    });

    if (!deliveryPerson) {
      throw new NotFoundException(`Delivery person with ID "${assignDto.deliveryPersonId}" not found or is not a delivery person`);
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        deliveryPersonId: assignDto.deliveryPersonId,
      },
      include: {
        orderItems: {
          include: {
            article: true,
          },
        },
        restaurant: true,
        deliveryPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  // Helper method to validate order status transitions
  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus, role: Role) {
    const validTransitions = {
      [OrderStatus.PENDING]: {
        [Role.RESTAURATEUR]: [OrderStatus.ACCEPTED, OrderStatus.CANCELED],
        [Role.ADMIN]: [OrderStatus.ACCEPTED, OrderStatus.CANCELED],
        [Role.CLIENT]: [OrderStatus.CANCELED],
      },
      [OrderStatus.ACCEPTED]: {
        [Role.RESTAURATEUR]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
        [Role.ADMIN]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
      },
      [OrderStatus.IN_PROGRESS]: {
        [Role.RESTAURATEUR]: [OrderStatus.READY],
        [Role.ADMIN]: [OrderStatus.READY],
      },
      [OrderStatus.READY]: {
        [Role.LIVREUR]: [OrderStatus.DELIVERED],
        [Role.ADMIN]: [OrderStatus.DELIVERED],
      },
      [OrderStatus.DELIVERED]: {
        // No further transitions
      },
      [OrderStatus.CANCELED]: {
        // No further transitions
      },
    };

    const allowedTransitions = validTransitions[currentStatus]?.[role] || [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus} for role ${role}`
      );
    }
  }
} 