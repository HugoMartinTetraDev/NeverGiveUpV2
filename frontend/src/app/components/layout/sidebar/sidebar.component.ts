import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  // Propriétés pour suivre les rôles de l'utilisateur
  hasCustomerRole: boolean = false;
  hasRestaurantOwnerRole: boolean = false;
  hasDelivererRole: boolean = false;
  hasDeveloperRole: boolean = false;
  hasCommercialRole: boolean = false;
  hasTechnicalRole: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialiser les rôles au chargement du composant
    this.updateUserRoles();
    
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe({
      next: () => this.updateUserRoles()
    });
  }

  private updateUserRoles(): void {
    const currentUser = this.authService.currentUser;
    
    if (currentUser && currentUser.roles) {
      // Réinitialiser tous les rôles
      this.hasCustomerRole = false;
      this.hasRestaurantOwnerRole = false;
      this.hasDelivererRole = false;
      this.hasDeveloperRole = false;
      this.hasCommercialRole = false;
      this.hasTechnicalRole = false;

      // Vérifier chaque rôle
      currentUser.roles.forEach(role => {
        if (role === UserRole.CUSTOMER) this.hasCustomerRole = true;
        if (role === UserRole.RESTAURANT_OWNER) this.hasRestaurantOwnerRole = true;
        if (role === UserRole.DELIVERER) this.hasDelivererRole = true;
        if (role === UserRole.DEVELOPER) {
          this.hasDeveloperRole = true;
          // Les développeurs ont également accès aux sections commerciales et techniques
          this.hasCommercialRole = true;
          this.hasTechnicalRole = true;
        }
      });
      
      console.log('Rôles utilisateur mis à jour:', {
        client: this.hasCustomerRole,
        restaurateur: this.hasRestaurantOwnerRole,
        livreur: this.hasDelivererRole,
        developpeur: this.hasDeveloperRole,
        commercial: this.hasCommercialRole,
        technique: this.hasTechnicalRole
      });
    } else {
      // Si pas d'utilisateur connecté, réinitialiser tous les rôles
      this.hasCustomerRole = false;
      this.hasRestaurantOwnerRole = false;
      this.hasDelivererRole = false;
      this.hasDeveloperRole = false;
      this.hasCommercialRole = false;
      this.hasTechnicalRole = false;
    }
  }

  // Méthode pour la déconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
