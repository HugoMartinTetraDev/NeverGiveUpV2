import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  constructor(private authService: AuthService) {}

  /**
   * Vérifie si l'utilisateur possède un rôle spécifique
   */
  hasRole(role: UserRole): boolean {
    const user = this.authService.currentUser;
    if (!user || !user.roles) return false;
    
    return user.roles.some(userRole => {
      // Permet la correspondance par chaîne ou par enum
      return userRole === role || String(userRole).toUpperCase() === String(role).toUpperCase();
    });
  }

  /**
   * Vérifie si l'utilisateur possède au moins un des rôles spécifiés
   */
  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Vérifie si l'utilisateur possède tous les rôles spécifiés
   */
  hasAllRoles(roles: UserRole[]): boolean {
    return roles.every(role => this.hasRole(role));
  }

  /**
   * Retourne tous les rôles de l'utilisateur
   */
  getUserRoles(): UserRole[] {
    const user = this.authService.currentUser;
    if (!user || !user.roles) return [];
    
    return user.roles.map(role => {
      // Assurer que chaque rôle est correctement typé
      return typeof role === 'string' ? role as UserRole : role;
    });
  }

  /**
   * Retourne le rôle principal de l'utilisateur
   */
  getPrimaryRole(): UserRole | null {
    const user = this.authService.currentUser;
    if (!user || !user.roles || user.roles.length === 0) return null;
    
    // Utilisé le rôle principal s'il existe
    if (user.primaryRole) return user.primaryRole;
    
    // Sinon retourner le premier rôle
    return user.roles[0];
  }

  // Méthodes spécifiques aux fonctionnalités
  canAccessClientFeatures(): boolean {
    return this.hasRole(UserRole.CLIENT) || this.hasRole(UserRole.ADMIN);
  }

  canAccessRestaurateurFeatures(): boolean {
    return this.hasRole(UserRole.RESTAURATEUR) || this.hasRole(UserRole.ADMIN);
  }

  canAccessLivreurFeatures(): boolean {
    return this.hasRole(UserRole.LIVREUR) || this.hasRole(UserRole.ADMIN);
  }

  canAccessAdminFeatures(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  // Fonctionnalités spécifiques
  canManageUsers(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  canViewStatistics(): boolean {
    return this.hasRole(UserRole.RESTAURATEUR) || this.hasRole(UserRole.ADMIN);
  }

  canManageOrders(): boolean {
    return this.hasAnyRole([UserRole.RESTAURATEUR, UserRole.LIVREUR, UserRole.ADMIN]);
  }
} 