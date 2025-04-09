import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
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

@ApiTags('menus')
@Controller('api/restaurants/:restaurantId/menu')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURATEUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new menu for a restaurant' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID' })
  @ApiResponse({ status: 201, description: 'Menu created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() createMenuDto: CreateMenuDto,
  ) {
    return this.menusService.create(restaurantId, createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus for a restaurant' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'List of menus retrieved' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  findAll(@Param('restaurantId') restaurantId: string) {
    return this.menusService.findAll(restaurantId);
  }

  @Put(':itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURATEUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a menu' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID' })
  @ApiParam({ name: 'itemId', description: 'Menu ID' })
  @ApiResponse({ status: 200, description: 'Menu updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant or menu not found' })
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('itemId') menuId: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menusService.update(restaurantId, menuId, updateMenuDto);
  }

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURATEUR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a menu' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID' })
  @ApiParam({ name: 'itemId', description: 'Menu ID' })
  @ApiResponse({ status: 200, description: 'Menu deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Restaurant or menu not found' })
  remove(
    @Param('restaurantId') restaurantId: string,
    @Param('itemId') menuId: string,
  ) {
    return this.menusService.remove(restaurantId, menuId);
  }
} 