import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { UserRole } from '../../../models/user.model';
import { HasRoleDirective } from '../../../directives/has-role.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, HasRoleDirective],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  // Pour accès au enum UserRole dans le template
  UserRole = UserRole;
  
  // Pour le débogage
  debugRoles: string = '';
  
  // Propriétés pour suivre les rôles spécifiques (utile pour les tests)
  hasClientRole = false;
  hasRestaurateurRole = false;
  hasLivreurRole = false;
  hasAdminRole = false;

  constructor(
    private authService: AuthService,
    public authorizationService: AuthorizationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe({
      next: (user) => {
        console.log("Utilisateur actuel:", user);
        this.updateRoleDebugInfo();
        this.updateRoleFlags();
      }
    });

    // Mise à jour initiale des rôles
    this.updateRoleDebugInfo();
    this.updateRoleFlags();
  }

  /**
   * Met à jour les informations de débogage sur les rôles
   */
  private updateRoleDebugInfo(): void {
    const roles = this.authorizationService.getUserRoles();
    this.debugRoles = JSON.stringify(roles);
    console.log("Rôles actuels:", roles);
  }

  /**
   * Met à jour les drapeaux de rôles spécifiques (pour tester/débogage)
   */
  private updateRoleFlags(): void {
    this.hasClientRole = this.authorizationService.hasRole(UserRole.CLIENT);
    this.hasRestaurateurRole = this.authorizationService.hasRole(UserRole.RESTAURATEUR);
    this.hasLivreurRole = this.authorizationService.hasRole(UserRole.LIVREUR);
    this.hasAdminRole = this.authorizationService.hasRole(UserRole.ADMIN);
    
    console.log("Drapeaux de rôles:", {
      client: this.hasClientRole,
      restaurateur: this.hasRestaurateurRole,
      livreur: this.hasLivreurRole,
      admin: this.hasAdminRole
    });
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
