import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';
import { Reflector } from '@nestjs/core';

/**
 * Décorateur pour marquer une route comme auditable
 */
export const Auditable = (action: string, description: string = '') => {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    const metadataValue = { action, description };
    Reflect.defineMetadata('is-auditable', metadataValue, descriptor?.value || target);
    return descriptor || target;
  };
};

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private prisma: PrismaService,
    private reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditableMetadata = this.reflector.get<{ action: string, description: string } | undefined>(
      'is-auditable',
      context.getHandler()
    );

    // Si la route n'est pas marquée comme auditable, on passe
    if (!auditableMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const action = auditableMetadata.action;
    const description = auditableMetadata.description;

    // Timestamp de début d'exécution
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: async (data) => {
          // Calculer le temps d'exécution
          const executionTime = Date.now() - now;

          // Enregistrer l'action dans les logs
          this.logger.log(
            `[AUDIT] Action ${action} effectuée par ${user?.id || 'utilisateur anonyme'} (${executionTime}ms)`
          );

          // Enregistrer l'événement dans la base de données
          try {
            await this.prisma.log.create({
              data: {
                service: 'audit',
                level: 'INFO',
                action: action,
                message: description || `Action ${action} exécutée`,
                userId: user?.id,
                metadata: {
                  path: request.url,
                  method: request.method,
                  ip: request.ip,
                  userAgent: request.headers['user-agent'],
                  executionTime,
                  params: request.params,
                  query: request.query,
                  userRoles: user?.roles || [],
                  // Ne pas inclure le body complet pour éviter de stocker des données sensibles
                  // Mais on peut stocker certaines informations pertinentes
                  bodyExcerpt: this.sanitizeBody(request.body)
                }
              }
            });
          } catch (error) {
            this.logger.error(`Erreur lors de l'enregistrement du log d'audit: ${error.message}`);
          }
        },
        error: async (error) => {
          // Calculer le temps d'exécution
          const executionTime = Date.now() - now;

          // Enregistrer l'erreur dans les logs
          this.logger.error(
            `[AUDIT] Erreur pendant l'action ${action} par ${user?.id || 'utilisateur anonyme'}: ${error.message}`
          );

          // Enregistrer l'événement d'erreur dans la base de données
          try {
            await this.prisma.log.create({
              data: {
                service: 'audit',
                level: 'ERROR',
                action: action,
                message: `Erreur pendant ${action}: ${error.message}`,
                userId: user?.id,
                metadata: {
                  path: request.url,
                  method: request.method,
                  ip: request.ip,
                  error: error.message,
                  stack: error.stack,
                  executionTime,
                  userRoles: user?.roles || []
                }
              }
            });
          } catch (logError) {
            this.logger.error(`Erreur lors de l'enregistrement du log d'erreur: ${logError.message}`);
          }
        }
      })
    );
  }

  /**
   * Nettoie les données du body pour éviter de stocker des informations sensibles
   */
  private sanitizeBody(body: any): any {
    if (!body) return null;

    const sanitized = { ...body };
    
    // Supprimer les données sensibles
    const sensibleFields = ['password', 'token', 'secret', 'creditCard', 'iban'];
    sensibleFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[HIDDEN]';
      }
    });

    // Limiter la taille pour éviter des logs trop volumineux
    return JSON.stringify(sanitized).slice(0, 500);
  }
} 