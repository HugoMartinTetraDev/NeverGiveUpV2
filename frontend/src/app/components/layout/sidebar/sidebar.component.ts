import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  
  // Événement émis lorsqu'un élément de menu est sélectionné
  @Output() menuItemSelected = new EventEmitter<void>();
  
  // Propriétés pour suivre les rôles spécifiques
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
        this.updateRoleFlags();
      }
    });

    // Mise à jour initiale des rôles
    this.updateRoleFlags();
  }

  /**
   * Met à jour les drapeaux de rôles spécifiques
   */
  private updateRoleFlags(): void {
    this.hasClientRole = this.authorizationService.hasRole(UserRole.CLIENT);
    this.hasRestaurateurRole = this.authorizationService.hasRole(UserRole.RESTAURATEUR);
    this.hasLivreurRole = this.authorizationService.hasRole(UserRole.LIVREUR);
    this.hasAdminRole = this.authorizationService.hasRole(UserRole.ADMIN);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.menuItemSelected.emit();
  }
  
  /**
   * Émet un événement lorsqu'un élément de menu est sélectionné
   */
  onMenuItemClick(): void {
    this.menuItemSelected.emit();
  }
}
