import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable, ValidationError } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../services';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: AppLoggerService;

  constructor() {
    this.logger = new AppLoggerService(GlobalExceptionFilter.name, { 
      logToFile: true
    });
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Statut de l'erreur
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Une erreur interne est survenue';
    let errors: Record<string, string> | null = null;
    let errorCode: string | null = null;

    // Si c'est une HttpException (erreur Nest gérée)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        const exceptionBody = exceptionResponse as any;
        // Récupère le message et les erreurs éventuelles pour les erreurs de validation
        message = exceptionBody.message || message;
        errors = exceptionBody.errors || null;
        errorCode = exceptionBody.errorCode || null;
        
        // Traitement spécial pour les erreurs d'authentification
        if (status === HttpStatus.UNAUTHORIZED) {
          message = 'Identifiant ou mot de passe incorrect';
          errorCode = 'AUTH_FAILED';
        }
        
        // Traitement spécial pour les erreurs de validation (ValidationPipe)
        if (Array.isArray(exceptionBody.message) && status === HttpStatus.BAD_REQUEST) {
          const validationErrors = exceptionBody.message as string[];
          message = "Erreur de validation";
          errors = this.formatValidationErrors(validationErrors);
        }
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception.code === 'P2002') {
      // Gestion des erreurs Prisma (exemple: violation de contrainte d'unicité)
      status = HttpStatus.CONFLICT;
      message = 'Une entrée avec ces données existe déjà';
      
      // Détection du champ en conflit
      if (exception.meta?.target) {
        const field = Array.isArray(exception.meta.target) 
          ? exception.meta.target[0] 
          : exception.meta.target;
          
        // Cas spécifique pour l'email lors de l'inscription
        if (field === 'email') {
          message = 'Un compte avec cet email existe déjà';
          errorCode = 'EMAIL_ALREADY_EXISTS';
        } else {
          message = `Une entrée avec ce ${field} existe déjà`;
          errorCode = 'UNIQUE_CONSTRAINT_VIOLATION';
        }
      }
    } else if (exception.code === 'P2025') {
      // Entité non trouvée dans Prisma
      status = HttpStatus.NOT_FOUND;
      message = 'La ressource demandée n\'existe pas';
      errorCode = 'RESOURCE_NOT_FOUND';
    } else if (exception.code === 'ECONNREFUSED') {
      // Erreur de connexion à la base de données
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Le service de base de données est indisponible';
      errorCode = 'DATABASE_UNAVAILABLE';
    }

    // Journalisation de l'erreur avec contexte
    const logMessage = `${request.method} ${request.url} - ${status} - ${message}`;
    if (status >= 500) {
      this.logger.error(logMessage, exception.stack);
    } else if (status >= 400) {
      this.logger.warn(logMessage);
    } else {
      this.logger.log(logMessage);
    }

    // Réponse formatée au client
    const responseBody: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    if (errors) {
      responseBody.errors = errors;
    }
    
    if (errorCode) {
      responseBody.errorCode = errorCode;
    }

    response
      .status(status)
      .json(responseBody);
  }
  
  private formatValidationErrors(validationErrors: string[]): Record<string, string> {
    const formattedErrors: Record<string, string> = {};
    
    for (const error of validationErrors) {
      // Extraction du champ et de l'erreur (format typique: "property field should match...")
      const matches = error.match(/^([a-zA-Z0-9.]+)\s+(.*)/);
      if (matches && matches.length >= 3) {
        const field = matches[1];
        const message = matches[2];
        formattedErrors[field] = message;
      } else {
        // Si le format ne correspond pas, utiliser l'erreur entière
        formattedErrors[`validation${Object.keys(formattedErrors).length}`] = error;
      }
    }
    
    return formattedErrors;
  }
} 