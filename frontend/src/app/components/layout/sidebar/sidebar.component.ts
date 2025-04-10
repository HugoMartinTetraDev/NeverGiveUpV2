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

  // Pour le débogage
  debugRoles: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialiser les rôles au chargement du composant
    this.updateUserRoles();
    
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe({
      next: (user) => {
        console.log("Changement d'utilisateur détecté:", user);
        this.updateUserRoles();
      }
    });

    // Diagnostique - Affichage des données utilisateur dans localStorage
    console.log("LocalStorage user_data:", localStorage.getItem('user_data'));
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user data:", parsedUser);
        console.log("User roles:", parsedUser.roles);
      }
    } catch (e) {
      console.error("Erreur lors de la lecture des données utilisateur:", e);
    }
  }

  private updateUserRoles(): void {
    const currentUser = this.authService.currentUser;
    
    console.log('Mise à jour des rôles utilisateur');
    console.log('Utilisateur actuel:', currentUser);
    
    // Réinitialiser tous les rôles
    this.hasCustomerRole = false;
    this.hasRestaurantOwnerRole = false;
    this.hasDelivererRole = false;
    this.hasDeveloperRole = false;
    this.hasCommercialRole = false;
    this.hasTechnicalRole = false;
    
    if (currentUser) {
      console.log('Roles utilisateur:', currentUser.roles);
      
      if (currentUser.roles && Array.isArray(currentUser.roles)) {
        // Pour le débogage
        this.debugRoles = JSON.stringify(currentUser.roles);
        console.log('Debug roles:', this.debugRoles);
        
        // Vérifions si l'utilisateur a un seul rôle principal
        const mainRole = currentUser.roles.length > 0 ? 
                         String(currentUser.roles[0]).toLowerCase() : '';
        
        console.log('Rôle principal:', mainRole);
        
        // Si l'utilisateur a un rôle principal de livreur, n'activer que ce rôle
        if (mainRole.includes('deliver') || mainRole.includes('livreur')) {
          console.log('Utilisateur avec rôle principal LIVREUR');
          this.hasDelivererRole = true;
          return; // Sortir pour ne pas activer d'autres rôles
        }
        
        // Si l'utilisateur a un rôle principal de restaurateur, n'activer que ce rôle
        if (mainRole.includes('restaurant') || mainRole.includes('restaurateur')) {
          console.log('Utilisateur avec rôle principal RESTAURATEUR');
          this.hasRestaurantOwnerRole = true;
          return; // Sortir pour ne pas activer d'autres rôles
        }

        // Par défaut, vérifier tous les rôles
        currentUser.roles.forEach(role => {
          console.log('Vérification du rôle:', role);
          const roleStr = String(role).toLowerCase();
          
          if (roleStr.includes('customer') || roleStr.includes('client')) {
            this.hasCustomerRole = true;
          }
          
          if (roleStr.includes('restaurant') || roleStr.includes('restaurateur')) {
            this.hasRestaurantOwnerRole = true;
          }
          
          if (roleStr.includes('deliver') || roleStr.includes('livreur')) {
            this.hasDelivererRole = true;
          }
          
          if (roleStr.includes('develop') || roleStr.includes('admin')) {
            this.hasDeveloperRole = true;
            // Les développeurs ont également accès aux sections commerciales et techniques
            this.hasCommercialRole = true;
            this.hasTechnicalRole = true;
          }
        });
      } else {
        console.log('Aucun rôle trouvé ou format invalide, attribution du rôle CLIENT par défaut');
        this.hasCustomerRole = true;
      }
      
      console.log('Rôles utilisateur mis à jour:', {
        client: this.hasCustomerRole,
        restaurateur: this.hasRestaurantOwnerRole,
        livreur: this.hasDelivererRole,
        developpeur: this.hasDeveloperRole,
        commercial: this.hasCommercialRole,
        technique: this.hasTechnicalRole
      });
    } else {
      console.log('Aucun utilisateur connecté');
    }
  }

  // Méthode pour la déconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
