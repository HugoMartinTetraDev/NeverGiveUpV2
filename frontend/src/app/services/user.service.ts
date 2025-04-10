import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

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
    return this.apiService.put<User>('users/profile', userData);
  }

  /**
   * Supprime le compte utilisateur
   */
  deleteUserAccount(): Observable<void> {
    return this.apiService.delete<void>('users/profile');
  }
} 