import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';
      
      // Gestion des erreurs selon le code HTTP
      switch (error.status) {
        case 0:
          // Erreur de connexion ou requête annulée
          if (error.error instanceof ProgressEvent) {
            // Ne pas afficher de notification pour les erreurs de progression/annulation
            return throwError(() => error);
          }
          errorMessage = 'Impossible de se connecter au serveur, vérifiez votre connexion internet';
          break;
        case 400:
          errorMessage = error.error?.message || 'Données invalides';
          if (error.error?.errors) {
            const validationErrors = Object.values(error.error.errors).join(', ');
            errorMessage = `Validation échouée: ${validationErrors}`;
          }
          break;
        case 401:
          errorMessage = 'Session expirée, veuillez vous reconnecter';
          // Ne pas déconnecter lors d'une tentative de connexion
          if (!req.url.includes('auth/login')) {
            authService.logout();
            router.navigate(['/login']);
          }
          break;
        case 403:
          errorMessage = 'Accès non autorisé pour cette ressource';
          break;
        case 404:
          errorMessage = `Ressource non trouvée: ${req.url.split('/').pop()}`;
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflit avec les données existantes';
          break;
        case 422:
          errorMessage = error.error?.message || 'Données non traitables';
          break;
        case 429:
          errorMessage = 'Trop de requêtes, veuillez réessayer dans un moment';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        case 503:
          errorMessage = 'Service temporairement indisponible';
          break;
        default:
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          break;
      }
      
      // Logging de l'erreur pour le développement
      console.error('API Error:', error);
      
      // Afficher la notification d'erreur
      notificationService.error(errorMessage);
      
      // Relancer l'erreur pour permettre aux services de la traiter si nécessaire
      return throwError(() => error);
    })
  );
}; 