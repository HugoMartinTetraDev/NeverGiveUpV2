import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getUserProfile(): Observable<User> {
    console.log('UserService: récupération du profil utilisateur');
    return this.apiService.get<User>('users/profile').pipe(
      tap(user => console.log('UserService: profil utilisateur reçu', user)),
      catchError(error => {
        console.error('UserService: erreur lors de la récupération du profil', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  updateUserProfile(userData: Partial<User>): Observable<User> {
    console.log('UserService: appel à updateUserProfile avec', userData);
    
    // Vérifier le format de la date si elle est présente
    if (userData.birthDate) {
      console.log('Format de la date envoyée:', userData.birthDate);
    }
    
    // Assurer que les données sont bien formatées
    const formattedData: any = { ...userData };
    
    // Supprimer les propriétés undefined ou null
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined || formattedData[key] === null) {
        delete formattedData[key];
      }
    });
    
    console.log('Données formatées pour l\'API:', formattedData);
    
    return this.apiService.put<User>('users/profile', formattedData)
      .pipe(
        tap(response => console.log('UserService: réponse de mise à jour', response)),
        catchError(error => {
          console.error('UserService: erreur de mise à jour', error);
          // Affichage détaillé de l'erreur
          if (error.error) {
            console.error('Détails de l\'erreur:', error.error);
            if (error.error.message) {
              console.error('Message d\'erreur:', error.error.message);
            }
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Supprime le compte utilisateur
   */
  deleteUserAccount(): Observable<void> {
    return this.apiService.delete<void>('users/profile').pipe(
      catchError(error => {
        console.error('UserService: erreur lors de la suppression du compte', error);
        return throwError(() => error);
      })
    );
  }
} 