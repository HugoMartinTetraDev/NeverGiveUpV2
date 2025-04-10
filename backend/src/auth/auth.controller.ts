import { Controller, Post, Body, UseGuards, Request, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Role } from '../common/enums';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Auditable } from '../common/interceptors/audit.interceptor';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authentification d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur authentifié avec succès' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' }
      },
      required: ['email', 'password'],
    },
  })
  @Auditable('USER_LOGIN', 'Connexion d\'un utilisateur')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @Auditable('USER_REGISTER', 'Création d\'un nouvel utilisateur')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rafraîchir le token d\'accès' })
  @ApiResponse({ status: 200, description: 'Token rafraîchi avec succès' })
  @ApiResponse({ status: 401, description: 'Token de rafraîchissement invalide' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      },
      required: ['refreshToken'],
    },
  })
  @Auditable('TOKEN_REFRESH', 'Rafraîchissement du token d\'accès')
  async refreshToken(@Body() refreshDto: { refreshToken: string }) {
    if (!refreshDto.refreshToken) {
      throw new UnauthorizedException('Token de rafraîchissement manquant');
    }
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupération du profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiBearerAuth()
  @Auditable('GET_PROFILE', 'Récupération du profil utilisateur')
  async getProfile(@Request() req) {
    // req.user est automatiquement fourni par le JwtAuthGuard
    return req.user;
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Vérification si l\'utilisateur est administrateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur est admin' })
  @ApiResponse({ status: 403, description: 'Utilisateur n\'est pas admin' })
  @ApiBearerAuth()
  @Auditable('CHECK_ADMIN', 'Vérification des droits d\'administrateur')
  checkAdmin() {
    return { message: 'Vous êtes administrateur' };
  }

  @Post('roles/add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Ajouter un rôle à un utilisateur' })
  @ApiResponse({ status: 200, description: 'Rôle ajouté avec succès' })
  @ApiResponse({ status: 403, description: 'Non autorisé' })
  @ApiResponse({ status: 400, description: 'Paramètres invalides' })
  @ApiBearerAuth()
  @Auditable('ADD_ROLE', 'Ajout d\'un rôle à un utilisateur')
  async addRole(@Body() body: { userId: string; role: Role }) {
    if (!body.userId || !body.role) {
      throw new UnauthorizedException('UserId et role sont requis');
    }
    return this.authService.addRoleToUser(body.userId, body.role);
  }

  @Post('roles/remove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un rôle d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Rôle supprimé avec succès' })
  @ApiResponse({ status: 403, description: 'Non autorisé' })
  @ApiResponse({ status: 400, description: 'Paramètres invalides' })
  @ApiBearerAuth()
  @Auditable('REMOVE_ROLE', 'Suppression d\'un rôle d\'un utilisateur')
  async removeRole(@Body() body: { userId: string; role: Role }) {
    if (!body.userId || !body.role) {
      throw new UnauthorizedException('UserId et role sont requis');
    }
    return this.authService.removeRoleFromUser(body.userId, body.role);
  }

  @Post('roles/get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer les rôles d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Rôles récupérés avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiBearerAuth()
  @Auditable('GET_ROLES', 'Récupération des rôles d\'un utilisateur')
  async getRoles(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new UnauthorizedException('UserId est requis');
    }
    return this.authService.getUserRoles(body.userId);
  }
} 