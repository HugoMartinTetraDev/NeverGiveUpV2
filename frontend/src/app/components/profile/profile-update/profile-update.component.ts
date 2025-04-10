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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  address: string;
  referralCode: string;
  birthDateObj: Date | null;
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
    FormsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
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
    referralCode: '',
    birthDateObj: null
  };
  
  originalProfile?: UserProfile;
  isLoading = false;
  isSaving = false;

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
        birthDate: currentUser.birthDate ? this.formatBirthDateForForm(currentUser.birthDate) : '',
        email: currentUser.email || '',
        password: '', // Le champ mot de passe est vide dans le formulaire de modification
        address: currentUser.address || '',
        referralCode: currentUser.referralCode || '',
        birthDateObj: currentUser.birthDate ? new Date(currentUser.birthDate) : null
      };
      
      console.log('Date de naissance chargée:', this.userProfile.birthDate);
      
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
            birthDate: profile.birthDate ? this.formatBirthDateForForm(profile.birthDate) : '',
            email: profile.email || '',
            password: '', // Le champ mot de passe est vide dans le formulaire de modification
            address: profile.address || '',
            referralCode: profile.referralCode || '',
            birthDateObj: profile.birthDate ? new Date(profile.birthDate) : null
          };
          
          console.log('Date de naissance chargée depuis API:', this.userProfile.birthDate);
          
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

  // Format pour l'affichage dans le formulaire (JJ/MM/AAAA)
  formatBirthDateForForm(dateString: string | Date): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      // Format JJ/MM/AAAA pour les inputs
      return formatDate(date, 'dd/MM/yyyy', 'fr-FR');
    } catch (error) {
      console.error('Erreur lors du formatage de la date pour le formulaire:', error);
      return '';
    }
  }

  // Ancienne méthode gardée pour compatibilité
  formatBirthDate(dateString: string | Date): string {
    return this.formatBirthDateForForm(dateString);
  }

  onSave(): void {
    console.log('Bouton Sauvegarder cliqué', this.userProfile);
    
    if (!this.hasChanges() && !this.birthDateChanged()) {
      this.notificationService.info('Aucune modification détectée');
      this.router.navigate(['/compte']);
      return;
    }
    
    this.isSaving = true;
    console.log('Début de la sauvegarde...');
    
    // Préparer les données à envoyer (uniquement celles qui ont changé)
    const updatedData: Partial<User> = {};
    
    if (this.userProfile.firstName !== this.originalProfile?.firstName) {
      updatedData.firstName = this.userProfile.firstName;
    }
    
    if (this.userProfile.lastName !== this.originalProfile?.lastName) {
      updatedData.lastName = this.userProfile.lastName;
    }
    
    // Vérifier si la date a changé en utilisant l'objet Date du datepicker
    if (this.birthDateChanged()) {
      if (this.userProfile.birthDateObj) {
        updatedData.birthDate = this.userProfile.birthDateObj;
        console.log('Date formatée pour l\'API:', this.userProfile.birthDateObj);
      }
    }
    
    if (this.userProfile.address !== this.originalProfile?.address) {
      updatedData.address = this.userProfile.address;
    }
    
    // Le mot de passe est un cas spécial, ne l'envoyer que s'il est rempli
    if (this.userProfile.password && this.userProfile.password.trim() !== '') {
      updatedData.password = this.userProfile.password;
    }
    
    console.log('Données à mettre à jour:', updatedData);
    
    // Appeler le service de mise à jour du profil
    this.userService.updateUserProfile(updatedData)
      .pipe(finalize(() => {
        console.log('Fin de la requête de mise à jour');
        this.isSaving = false;
      }))
      .subscribe({
        next: (updatedUser) => {
          console.log('Profil mis à jour avec succès:', updatedUser);
          this.notificationService.success('Profil mis à jour avec succès');
          
          // Mettre à jour les données utilisateur dans le service d'authentification
          this.authService.refreshUserData(updatedUser);
          
          // Rediriger vers la page du profil
          this.router.navigate(['/compte']);
        },
        error: (error) => {
          console.error('Erreur détaillée lors de la mise à jour du profil:', error);
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
      this.userProfile.address !== this.originalProfile.address ||
      (this.userProfile.password && this.userProfile.password.trim() !== '')
    );
  }

  /**
   * Vérifie si la date de naissance a été modifiée
   */
  birthDateChanged(): boolean {
    if (!this.originalProfile?.birthDate && !this.userProfile.birthDateObj) {
      return false;
    }
    
    if (!this.originalProfile?.birthDate && this.userProfile.birthDateObj) {
      return true;
    }
    
    if (this.originalProfile?.birthDate && !this.userProfile.birthDateObj) {
      return true;
    }
    
    const originalDate = new Date(this.originalProfile?.birthDate || '');
    
    if (isNaN(originalDate.getTime())) {
      return this.userProfile.birthDateObj !== null;
    }
    
    if (!this.userProfile.birthDateObj) {
      return true;
    }
    
    return originalDate.toISOString().split('T')[0] !== this.userProfile.birthDateObj.toISOString().split('T')[0];
  }
} 