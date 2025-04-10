import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from '../orders/orders.service';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly ordersService: OrdersService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURATEUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createRestaurantDto: CreateRestaurantDto, @Request() req) {
    // Associate restaurant with authenticated user if role is RESTAURATEUR
    const ownerId = req.user.role === Role.RESTAURATEUR ? req.user.id : undefined;
    return this.restaurantsService.create(createRestaurantDto, ownerId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({ status: 200, description: 'List of all restaurants' })
  findAll() {
    return this.restaurantsService.findAll();
  }

  /**
   * ATTENTION: Les routes spécifiques doivent être AVANT les routes paramétrées (:id)
   * pour éviter les conflits dans la résolution des routes.
   */
  
  @Get('my-restaurant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURATEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the restaurant owned by the authenticated restaurateur' })
  @ApiResponse({ status: 200, description: 'Restaurant retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async getMyRestaurant(@Request() req) {
    // Récupérer le restaurant dont le ownerId correspond à l'ID de l'utilisateur connecté
    return this.restaurantsService.findByOwnerId(req.user.id);
  }

  @Get('my-restaurant/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURATEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders for the restaurant owned by the authenticated user' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async getMyRestaurantOrders(@Request() req) {
    try {
      // Récupérer d'abord le restaurant de l'utilisateur
      const restaurant = await this.restaurantsService.findByOwnerId(req.user.id);
      if (!restaurant) {
        return [];
      }
      
      // Utiliser le service des commandes pour récupérer les commandes du restaurant
      return this.ordersService.findAllByRestaurantId(restaurant.id);
    } catch (error) {
      console.error('Error fetching restaurant orders:', error);
      return [];
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a restaurant by ID' })
  @ApiParam({ name: 'id', description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'Restaurant found' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURATEUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiParam({ name: 'id', description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'Restaurant updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiParam({ name: 'id', description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'Restaurant deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }

  @Get(':id/statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURATEUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurant statistics' })
  @ApiParam({ name: 'id', description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'Restaurant statistics retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  getStatistics(@Param('id') id: string) {
    return this.restaurantsService.getStatistics(id);
  }
} 