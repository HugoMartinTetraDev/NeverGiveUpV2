import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si aucun rôle n'est requis, l'accès est autorisé
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Si aucun utilisateur n'est trouvé, l'accès est refusé
    if (!user) {
      this.logger.warn(
        `Tentative d'accès non authentifiée à ${request.method} ${request.url}`
      );
      return false;
    }
    
    // Vérifier si l'utilisateur a au moins un des rôles requis
    // Assurer que user.roles est toujours un tableau
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    // Enregistrement dans les logs des tentatives d'accès non autorisées
    if (!hasRequiredRole) {
      this.logger.warn(
        `Tentative d'accès non autorisée: utilisateur ${user.id} avec rôles ${JSON.stringify(userRoles)} `+
        `a essayé d'accéder à ${request.method} ${request.url}`
      );
      
      // Enregistrer l'événement dans la base de données pour audit
      try {
        await this.prisma.log.create({
          data: {
            service: 'auth',
            level: 'WARNING',
            action: 'UNAUTHORIZED_ACCESS',
            message: `Accès refusé à ${request.method} ${request.url}`,
            userId: user.id,
            metadata: {
              requiredRoles,
              userRoles,
              path: request.url,
              method: request.method,
              ip: request.ip,
              userAgent: request.headers['user-agent'],
            }
          }
        });
      } catch (error) {
        this.logger.error(`Erreur lors de l'enregistrement du log d'audit: ${error.message}`);
      }
    }
    
    return hasRequiredRole;
  }
} 