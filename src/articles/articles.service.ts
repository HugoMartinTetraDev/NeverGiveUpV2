import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(restaurantId: string, createArticleDto: CreateArticleDto) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${restaurantId}" not found`);
    }

    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        restaurant: { connect: { id: restaurantId } },
      },
    });
  }

  async findAll(restaurantId: string) {
    // Check if restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${restaurantId}" not found`);
    }

    return this.prisma.article.findMany({
      where: { restaurantId },
    });
  }

  async findOne(id: string, restaurantId: string) {
    const article = await this.prisma.article.findFirst({
      where: {
        id,
        restaurantId,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID "${id}" not found in restaurant "${restaurantId}"`);
    }

    return article;
  }

  async update(id: string, restaurantId: string, updateArticleDto: UpdateArticleDto) {
    // Check if article exists in the given restaurant
    await this.findOne(id, restaurantId);

    // Update article
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async remove(id: string, restaurantId: string) {
    // Check if article exists in the given restaurant
    await this.findOne(id, restaurantId);

    // Delete article
    return this.prisma.article.delete({
      where: { id },
    });
  }
} 