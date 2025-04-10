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
    return this.apiService.get<User>('users/profile');
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  updateUserProfile(userData: Partial<User>): Observable<User> {
    console.log('UserService: appel à updateUserProfile avec', userData);
    return this.apiService.put<User>('users/profile', userData)
      .pipe(
        tap(response => console.log('UserService: réponse de mise à jour', response)),
        catchError(error => {
          console.error('UserService: erreur de mise à jour', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Supprime le compte utilisateur
   */
  deleteUserAccount(): Observable<void> {
    return this.apiService.delete<void>('users/profile');
  }
} 