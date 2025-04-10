import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthorizationService } from '../services/authorization.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private authorizationService: AuthorizationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Récupérer les rôles requis définis dans la configuration de la route
    const requiredRoles = route.data['roles'] as UserRole[];
    
    // Si aucun rôle n'est spécifié, autoriser l'accès
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn) {
      console.log('Utilisateur non authentifié, redirection vers login');
      this.router.navigate(['/login']);
      return false;
    }
    
    // Vérifier si l'utilisateur a l'un des rôles requis
    const hasRequiredRole = this.authorizationService.hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      console.log('Accès non autorisé, l\'utilisateur n\'a pas les rôles requis', requiredRoles);
      this.router.navigate(['/landing']);
      return false;
    }
    
    return true;
  }
} 