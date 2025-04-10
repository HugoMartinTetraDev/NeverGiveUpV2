import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserRole } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { FormsModule } from '@angular/forms';

// Interface pour permettre les entrées avec birthDate en string ou Date
interface UserWithRoles {
  id: number;
  roles: UserRole[];
  primaryRole?: UserRole;
  [key: string]: any; // Pour permettre les autres propriétés
}

@Component({
  selector: 'app-user-roles-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-roles-manager.component.html',
  styleUrl: './user-roles-manager.component.scss'
})
export class UserRolesManagerComponent implements OnInit {
  @Input() user!: UserWithRoles;
  allRoles = Object.values(UserRole);
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Pour l'interface
  UserRole = UserRole; // Exposer l'enum pour le template
  
  constructor(
    private authService: AuthService,
    private authorizationService: AuthorizationService
  ) {}
  
  ngOnInit(): void {
    if (!this.user) {
      this.user = this.authService.currentUser!;
    }
  }
  
  hasRole(role: UserRole): boolean {
    return this.user?.roles?.includes(role) || false;
  }
  
  onRoleToggle(role: UserRole, event: Event): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.user || !this.user.roles) return;
    
    // Extraire la valeur checked de l'élément input
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked && !this.hasRole(role)) {
      // Ajouter le rôle
      this.addRole(role);
    } else if (!isChecked && this.hasRole(role)) {
      // Supprimer le rôle
      this.removeRole(role);
    }
  }
  
  addRole(role: UserRole): void {
    this.isLoading = true;
    
    if (!this.user.roles.includes(role)) {
      // Copier le tableau des rôles et ajouter le nouveau rôle
      const updatedRoles = [...this.user.roles, role];
      
      // Pour une démo simple, on met juste à jour localement
      this.user.roles = updatedRoles;
      
      // Créer un objet conforme à User avant de le passer à refreshUserData
      if (this.authService.currentUser && this.user.id === this.authService.currentUser.id) {
        const userToUpdate = { ...this.authService.currentUser };
        userToUpdate.roles = updatedRoles;
        this.authService.refreshUserData(userToUpdate);
      }
      
      this.successMessage = `Rôle ${role} ajouté avec succès`;
      this.isLoading = false;
      
      // Dans une implémentation réelle, on appellerait le backend:
      // this.authService.updateUserRoles(this.user.id, updatedRoles).subscribe(...)
    }
  }
  
  removeRole(role: UserRole): void {
    this.isLoading = true;
    
    // Vérifier qu'on ne supprime pas le dernier rôle
    if (this.user.roles.length <= 1) {
      this.errorMessage = 'Impossible de supprimer le dernier rôle';
      this.isLoading = false;
      return;
    }
    
    if (this.user.roles.includes(role)) {
      // Filtrer le tableau des rôles pour enlever le rôle
      const updatedRoles = this.user.roles.filter(r => r !== role);
      
      // Pour une démo simple, on met juste à jour localement
      this.user.roles = updatedRoles;
      
      // Mettre à jour le rôle principal si c'était celui qu'on vient de supprimer
      if (this.user.primaryRole === role) {
        this.user.primaryRole = updatedRoles[0];
      }
      
      // Créer un objet conforme à User avant de le passer à refreshUserData
      if (this.authService.currentUser && this.user.id === this.authService.currentUser.id) {
        const userToUpdate = { ...this.authService.currentUser };
        userToUpdate.roles = updatedRoles;
        userToUpdate.primaryRole = this.user.primaryRole;
        this.authService.refreshUserData(userToUpdate);
      }
      
      this.successMessage = `Rôle ${role} supprimé avec succès`;
      this.isLoading = false;
      
      // Dans une implémentation réelle, on appellerait le backend:
      // this.authService.updateUserRoles(this.user.id, updatedRoles).subscribe(...)
    }
  }
  
  setPrimaryRole(role: UserRole): void {
    if (!this.user.roles.includes(role)) return;
    
    this.user.primaryRole = role;
    
    // Créer un objet conforme à User avant de le passer à refreshUserData
    if (this.authService.currentUser && this.user.id === this.authService.currentUser.id) {
      const userToUpdate = { ...this.authService.currentUser };
      userToUpdate.primaryRole = role;
      this.authService.refreshUserData(userToUpdate);
    }
    
    this.successMessage = `${role} défini comme rôle principal`;
    
    // Dans une implémentation réelle, on appellerait le backend:
    // this.authService.setPrimaryRole(this.user.id, role).subscribe(...)
  }
}
