import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileDeleteDialogComponent } from './profile-delete-dialog/profile-delete-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../models/user.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserRolesManagerComponent } from './user-roles-manager/user-roles-manager.component';

// Interface pour le profil utilisateur avec birthDate en string pour l'affichage
interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string; // Format pour l'affichage
  email: string;
  password: string;
  address: string;
  referralCode: string;
  status: 'Actif' | 'Suspendu';
  roles: UserRole[];
  primaryRole?: UserRole;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatProgressSpinnerModule,
    UserRolesManagerComponent
  ]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = {
    id: 0,
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    password: '••••••••••',
    address: '',
    referralCode: '',
    status: 'Actif',
    roles: []
  };

  friendReferralCode: string = '';
  referralSuccess: boolean = false;
  referralMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private authService: AuthService,
    private userService: UserService
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
        id: currentUser.id,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        birthDate: currentUser.birthDate ? this.formatBirthDate(currentUser.birthDate) : '',
        email: currentUser.email || '',
        password: '••••••••••', // On ne montre jamais le vrai mot de passe
        address: currentUser.address || '',
        referralCode: currentUser.referralCode || 'POPEAT-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: currentUser.status || 'Actif',
        roles: currentUser.roles || [],
        primaryRole: currentUser.primaryRole
      };
      this.isLoading = false;
    } else {
      // Si pas d'utilisateur, essayer de récupérer le profil
      this.userService.getUserProfile().subscribe({
        next: (profile: User) => {
          this.userProfile = {
            id: profile.id,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            birthDate: profile.birthDate ? this.formatBirthDate(profile.birthDate) : '',
            email: profile.email || '',
            password: '••••••••••',
            address: profile.address || '',
            referralCode: profile.referralCode || 'POPEAT-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            status: profile.status || 'Actif',
            roles: profile.roles || [],
            primaryRole: profile.primaryRole
          };
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors de la récupération du profil:', error);
          this.notificationService.error('Impossible de récupérer votre profil');
          this.isLoading = false;
        }
      });
    }
  }

  formatBirthDate(dateString: string | Date): string {
    try {
      if (!dateString) {
        return '';
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Date invalide:', dateString);
        return '';
      }
      
      // Pour l'affichage dans le profil, format français
      return formatDate(date, 'dd/MM/yyyy', 'fr-FR');
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error, dateString);
      return '';
    }
  }

  onModify(): void {
    this.router.navigate(['/compte/modifier']);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ProfileDeleteDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si la suppression a réussi
        this.notificationService.success('Votre compte a été supprimé avec succès');
        
        // Rediriger vers la page de connexion
        this.router.navigate(['/login']);
      }
    });
  }

  onConfirmReferral(): void {
    // Mock validation - in real app this would be a backend call
    if (this.friendReferralCode === '1458-9632') {
      this.referralSuccess = true;
      this.referralMessage = 'Code de parrainage validé avec succès !';
      
      // Add notification
      this.notificationService.addNotification({
        icon: 'local_offer',
        title: 'Parrainage validé',
        message: 'Coupon de réduction de 10% sur votre prochaine commande !',
        time: 'À l\'instant'
      });

      // Show snackbar
      this.snackBar.open('Un coupon de réduction de 10% a été ajouté à vos notifications !', 'Fermer', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    } else {
      this.referralSuccess = false;
      this.referralMessage = 'Code de parrainage invalide';
    }
  }
} 