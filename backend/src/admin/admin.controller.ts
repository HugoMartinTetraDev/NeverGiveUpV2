import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get system statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not an admin' })
  getSystemStats() {
    return this.adminService.getSystemStats();
  }

  @Get('config')
  @ApiOperation({ summary: 'Get system configuration (admin only)' })
  @ApiResponse({ status: 200, description: 'System configuration retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not an admin' })
  getSystemConfig() {
    return this.adminService.getSystemConfig();
  }

  @Put('config/:key')
  @ApiOperation({ summary: 'Update system configuration (admin only)' })
  @ApiParam({ name: 'key', description: 'Configuration key' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'string', example: 'some-value' },
      },
      required: ['value'],
    },
  })
  @ApiResponse({ status: 200, description: 'System configuration updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not an admin' })
  updateSystemConfig(
    @Param('key') key: string,
    @Body() body: { value: string },
  ) {
    return this.adminService.updateSystemConfig(key, body.value);
  }
} 