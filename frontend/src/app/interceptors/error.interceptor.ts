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
        case 401:
          errorMessage = 'Session expirée, veuillez vous reconnecter';
          authService.logout();
          router.navigate(['/login']);
          break;
        case 403:
          errorMessage = 'Accès non autorisé';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
        default:
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          break;
      }
      
      // Afficher la notification d'erreur
      notificationService.error(errorMessage);
      
      // Relancer l'erreur pour permettre aux services de la traiter si nécessaire
      return throwError(() => error);
    })
  );
}; 