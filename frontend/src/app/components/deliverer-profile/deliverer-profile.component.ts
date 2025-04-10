import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileDeleteDialogComponent } from '../profile/profile-delete-dialog/profile-delete-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface DelivererProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  siretNumber: string;
  accountHolder: string;
  iban: string;
  referralCode: string;
}

@Component({
  selector: 'app-deliverer-profile',
  templateUrl: './deliverer-profile.component.html',
  styleUrls: ['./deliverer-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FormsModule
  ]
})
export class DelivererProfileComponent implements OnInit {
  delivererProfile: DelivererProfile = {
    firstName: 'Jhon',
    lastName: 'Doe',
    birthDate: '01/01/2020',
    email: 'cesi@cesi.Fr',
    password: '**********',
    address: '24 Le Paquebot',
    phoneNumber: '+33 6 00 00 00 00',
    siretNumber: '012 345 678 90123',
    accountHolder: 'Jhon DOE',
    iban: 'FR76 3000 4028 3798 7654 3210 943',
    referralCode: '1256-9856'
  };

  friendReferralCode: string = '';
  referralSuccess: boolean = false;
  referralMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        console.log('Données utilisateur reçues:', user);
        
        // Récupérer le titulaire du compte depuis le localStorage si disponible
        const savedAccountHolder = localStorage.getItem('accountHolder');
        
        // Mettre à jour les données du profil avec les données de l'utilisateur
        this.delivererProfile = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          birthDate: user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '',
          email: user.email || '',
          password: '**********', // Pour masquer le mot de passe
          address: user.address || '',
          phoneNumber: user.phoneNumber || '',
          siretNumber: user.siret || user.siretNumber || '',
          accountHolder: savedAccountHolder || user.accountHolder || '',
          iban: user.iban || '',
          referralCode: user.referralCode || ''
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.snackBar.open('Erreur lors du chargement du profil', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  onModify(): void {
    this.router.navigate(['/deliverer/compte/modifier']);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ProfileDeleteDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUserAccount().subscribe({
          next: () => {
            console.log('Deliverer profile deleted');
            this.snackBar.open('Votre compte a été supprimé avec succès', 'Fermer', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du compte:', error);
            this.snackBar.open('Erreur lors de la suppression du compte', 'Fermer', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  onConfirmReferral(): void {
    if (this.friendReferralCode === '1234-5648') {
      this.referralSuccess = true;
      this.referralMessage = 'Code de parrainage validé avec succès !';
      
      // Mise à jour des données utilisateur avec le code de parrainage
      this.userService.updateUserProfile({ referredBy: this.friendReferralCode }).subscribe({
        next: () => {
          this.notificationService.addNotification({
            icon: 'local_offer',
            title: 'Parrainage validé',
            message: 'Bonus de 50€ après 50 livraisons !',
            time: 'À l\'instant'
          });
  
          this.snackBar.open('Un bonus de 50€ sera ajouté après 50 livraisons', 'Fermer', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Erreur lors de la validation du code de parrainage:', error);
          this.referralSuccess = false;
          this.referralMessage = 'Erreur lors de la validation du code';
        }
      });
    } else {
      this.referralSuccess = false;
      this.referralMessage = 'Code de parrainage invalide';
    }
  }
} 