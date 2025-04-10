import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';

/**
 * Intercepteur pour journaliser les opérations sensibles (création, suppression, etc.)
 */
export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const apiService = inject(ApiService);
  
  // Liste des URL sensibles qui doivent être journalisées
  const sensitiveOperations = [
    { url: 'auth/login', method: 'POST', operation: 'LOGIN' },
    { url: 'auth/register', method: 'POST', operation: 'REGISTER' },
    { url: 'users', method: 'POST', operation: 'CREATE_USER' },
    { url: 'users', method: 'PUT', operation: 'UPDATE_USER' },
    { url: 'users', method: 'DELETE', operation: 'DELETE_USER' },
    { url: 'restaurants', method: 'POST', operation: 'CREATE_RESTAURANT' },
    { url: 'restaurants', method: 'PUT', operation: 'UPDATE_RESTAURANT' },
    { url: 'restaurants', method: 'DELETE', operation: 'DELETE_RESTAURANT' },
    { url: 'orders', method: 'POST', operation: 'CREATE_ORDER' },
    { url: 'orders', method: 'PUT', operation: 'UPDATE_ORDER' },
    { url: 'orders', method: 'DELETE', operation: 'DELETE_ORDER' },
  ];
  
  // Vérifier si la requête est une opération sensible
  const sensitiveOp = sensitiveOperations.find(op => 
    req.url.includes(op.url) && req.method === op.method
  );
  
  if (!sensitiveOp) {
    return next(req);
  }
  
  const startTime = Date.now();
  let statusCode: number;
  
  // Journaliser l'opération
  console.log(`[CLIENT LOG] Opération sensible: ${sensitiveOp.operation} - ${req.url}`);
  
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          statusCode = event.status;
        }
      },
      error: (error) => {
        statusCode = error.status || 0;
        console.error(`[CLIENT LOG] Échec de l'opération ${sensitiveOp.operation}: ${error.message}`);
        
        // Envoyer le log d'erreur au serveur (de manière silencieuse)
        const errorDetails = {
          operation: sensitiveOp.operation,
          url: req.url,
          method: req.method,
          status: statusCode,
          errorMessage: error.message,
          timestamp: new Date().toISOString()
        };
        
        // Créer une nouvelle requête pour éviter la récursion dans l'intercepteur
        const logReq = new HttpRequest('POST', 'logs/client', {
          ...errorDetails,
          level: 'ERROR'
        });
        
        // Envoyer la requête directement au handler, en ignorant les intercepteurs
        apiService.sendDirectRequest(logReq).subscribe();
      }
    }),
    finalize(() => {
      const elapsedTime = Date.now() - startTime;
      console.log(`[CLIENT LOG] Opération ${sensitiveOp.operation} terminée en ${elapsedTime}ms avec statut ${statusCode || 'inconnu'}`);
      
      // Pour les opérations réussies, envoyer un log au serveur
      if (statusCode >= 200 && statusCode < 300) {
        const logDetails = {
          operation: sensitiveOp.operation,
          url: req.url,
          method: req.method,
          status: statusCode,
          elapsedTime,
          timestamp: new Date().toISOString()
        };
        
        // Créer une nouvelle requête pour éviter la récursion dans l'intercepteur
        const logReq = new HttpRequest('POST', 'logs/client', {
          ...logDetails,
          level: 'INFO'
        });
        
        // Envoyer la requête directement au handler, en ignorant les intercepteurs
        apiService.sendDirectRequest(logReq).subscribe();
      }
    })
  );
}; 