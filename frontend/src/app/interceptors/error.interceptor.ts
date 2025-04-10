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
          // Traitement spécifique pour les erreurs de validation
          if (req.url.includes('auth/register')) {
            errorMessage = handleRegistrationErrors(error);
          } else {
            errorMessage = handleBadRequestErrors(error);
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
          if (req.url.includes('auth/register') && error.error?.errorCode === 'EMAIL_ALREADY_EXISTS') {
            errorMessage = 'Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse ou vous connecter.';
          } else {
            errorMessage = error.error?.message || 'Conflit avec les données existantes';
          }
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

/**
 * Traite les erreurs spécifiques à l'enregistrement d'utilisateur
 */
function handleRegistrationErrors(error: HttpErrorResponse): string {
  // Vérifier si l'erreur a une structure pour les erreurs de validation
  if (error.error?.errors) {
    // Extraction des messages d'erreur de validation pour les champs
    const validationErrors = Object.entries(error.error.errors)
      .map(([field, message]) => {
        const fieldName = getFieldName(field);
        return `${fieldName}: ${message}`;
      })
      .join('\n');
    
    return `Erreurs dans le formulaire :\n${validationErrors}`;
  }
  
  // Cas où l'erreur est simplement un message
  return error.error?.message || 'Erreur lors de l\'inscription. Vérifiez les informations saisies.';
}

/**
 * Traite les erreurs générales de type 400 (Bad Request)
 */
function handleBadRequestErrors(error: HttpErrorResponse): string {
  if (error.error?.errors) {
    return Object.values(error.error.errors).join(', ');
  }
  
  return error.error?.message || 'Données invalides. Veuillez vérifier votre saisie.';
}

/**
 * Traduit les noms de champs techniques en noms lisibles
 */
function getFieldName(fieldKey: string): string {
  const fieldNames: Record<string, string> = {
    'email': 'Email',
    'password': 'Mot de passe',
    'firstName': 'Prénom',
    'lastName': 'Nom',
    'phoneNumber': 'Numéro de téléphone',
    'address': 'Adresse',
    'birthDate': 'Date de naissance',
    'role': 'Rôle',
    'siret': 'Numéro SIRET',
    'iban': 'IBAN'
  };
  
  return fieldNames[fieldKey] || fieldKey;
} 