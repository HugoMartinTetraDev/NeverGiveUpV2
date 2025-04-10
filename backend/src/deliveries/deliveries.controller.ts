import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { AssignDeliveryPersonDto, UpdateOrderStatusDto } from '../orders/dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('deliveries')
@Controller('api/deliveries')
export class DeliveriesController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LIVREUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all deliveries' })
  @ApiResponse({ status: 200, description: 'List of deliveries retrieved' })
  findAll(@Request() req) {
    return this.ordersService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LIVREUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a delivery by ID' })
  @ApiParam({ name: 'id', description: 'Delivery ID' })
  @ApiResponse({ status: 200, description: 'Delivery found' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LIVREUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update delivery status' })
  @ApiParam({ name: 'id', description: 'Delivery ID' })
  @ApiResponse({ status: 200, description: 'Delivery status updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid status transition' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto,
      req.user.id,
      req.user.role,
    );
  }

  @Post(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a delivery person to an order' })
  @ApiParam({ name: 'id', description: 'Delivery ID' })
  @ApiResponse({ status: 200, description: 'Delivery person assigned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Delivery or delivery person not found' })
  assignDeliveryPerson(
    @Param('id') id: string,
    @Body() assignDto: AssignDeliveryPersonDto,
  ) {
    return this.ordersService.assignDeliveryPerson(id, assignDto);
  }
} 