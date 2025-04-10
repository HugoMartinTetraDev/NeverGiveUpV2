import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../../../services/notification.service';

interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  address: string;
  referralCode: string;
}

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ]
})
export class ProfileUpdateComponent implements OnInit {
  userProfile: UserProfile = {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    password: '',
    address: '',
    referralCode: ''
  };
  
  originalProfile: UserProfile | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService, 
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    
    // Récupérer les données de l'utilisateur courant
    const currentUser = this.authService.currentUser;
    
    if (currentUser) {
      // Utiliser les données du localStorage si disponibles
      this.userProfile = {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        birthDate: currentUser.birthDate ? this.formatBirthDate(currentUser.birthDate) : '',
        email: currentUser.email || '',
        password: '', // Le champ mot de passe est vide dans le formulaire de modification
        address: currentUser.address || '',
        referralCode: currentUser.referralCode || ''
      };
      
      // Conserver une copie des données originales pour la comparaison
      this.originalProfile = {...this.userProfile};
      this.isLoading = false;
    } else {
      // Si pas d'utilisateur, essayer de récupérer le profil
      this.userService.getUserProfile().subscribe({
        next: (profile: User) => {
          this.userProfile = {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            birthDate: profile.birthDate ? this.formatBirthDate(profile.birthDate) : '',
            email: profile.email || '',
            password: '', // Le champ mot de passe est vide dans le formulaire de modification
            address: profile.address || '',
            referralCode: profile.referralCode || ''
          };
          
          // Conserver une copie des données originales pour la comparaison
          this.originalProfile = {...this.userProfile};
        },
        error: (error: any) => {
          console.error('Erreur lors de la récupération du profil:', error);
          this.notificationService.error('Impossible de récupérer votre profil');
          this.router.navigate(['/compte']);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  formatBirthDate(dateString: string | Date): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return formatDate(date, 'yyyy-MM-dd', 'fr-FR');
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return '';
    }
  }

  onSave(): void {
    if (!this.hasChanges()) {
      this.notificationService.info('Aucune modification détectée');
      this.router.navigate(['/compte']);
      return;
    }
    
    this.isSaving = true;
    
    // Préparer les données à envoyer (uniquement celles qui ont changé)
    const updatedData: Partial<User> = {};
    
    if (this.userProfile.firstName !== this.originalProfile?.firstName) {
      updatedData.firstName = this.userProfile.firstName;
    }
    
    if (this.userProfile.lastName !== this.originalProfile?.lastName) {
      updatedData.lastName = this.userProfile.lastName;
    }
    
    if (this.userProfile.birthDate !== this.originalProfile?.birthDate) {
      updatedData.birthDate = new Date(this.userProfile.birthDate);
    }
    
    if (this.userProfile.address !== this.originalProfile?.address) {
      updatedData.address = this.userProfile.address;
    }
    
    // Le mot de passe est un cas spécial, ne l'envoyer que s'il est rempli
    if (this.userProfile.password && this.userProfile.password.trim() !== '') {
      updatedData.password = this.userProfile.password;
    }
    
    // Appeler le service de mise à jour du profil
    this.userService.updateUserProfile(updatedData)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: (updatedUser) => {
          this.notificationService.success('Profil mis à jour avec succès');
          
          // Mettre à jour les données utilisateur dans le service d'authentification
          this.authService.refreshUserData(updatedUser);
          
          // Rediriger vers la page du profil
          this.router.navigate(['/compte']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du profil:', error);
          this.notificationService.error('Erreur lors de la mise à jour du profil');
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/compte']);
  }
  
  private hasChanges(): boolean {
    if (!this.originalProfile) return false;
    
    return !!(
      this.userProfile.firstName !== this.originalProfile.firstName ||
      this.userProfile.lastName !== this.originalProfile.lastName ||
      this.userProfile.birthDate !== this.originalProfile.birthDate ||
      this.userProfile.address !== this.originalProfile.address ||
      (this.userProfile.password && this.userProfile.password.trim() !== '')
    );
  }
} 