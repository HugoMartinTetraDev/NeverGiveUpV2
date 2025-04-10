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
import { NotificationService } from '../../services/mocked/notification.service';

interface RestaurateurProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  businessName: string;
  siretNumber: string;
  accountHolder: string;
  iban: string;
  deliveryFee: number;
  referralCode: string;
}

@Component({
  selector: 'app-restaurateur-profile',
  templateUrl: './restaurateur-profile.component.html',
  styleUrls: ['./restaurateur-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule
  ]
})
export class RestaurateurProfileComponent implements OnInit {
  restaurateurProfile: RestaurateurProfile = {
    firstName: 'Jhon',
    lastName: 'Doe',
    birthDate: '01/01/2020',
    email: 'cesi@cesi.Fr',
    password: '**********',
    address: '24 Le Paquebot',
    phoneNumber: '+33 6 00 00 00 00',
    businessName: 'L\'escale',
    siretNumber: '012 345 678 90123',
    accountHolder: 'Jhon DOE',
    iban: 'FR76 3000 4028 3798 7654 3210 943',
    deliveryFee: 6.00,
    referralCode: '1234-5678'
  };

  friendReferralCode: string = '';
  referralSuccess: boolean = false;
  referralMessage: string = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void { }

  onModify(): void {
    this.router.navigate(['/restaurateur/compte/modifier']);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ProfileDeleteDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Restaurant profile deleted');
        this.router.navigate(['/']);
      }
    });
  }

  onConfirmReferral(): void {
    // Mock validation - in real app this would be a backend call
    if (this.friendReferralCode === '1234-5678') {
      this.referralSuccess = true;
      this.referralMessage = 'Code de parrainage validé avec succès !';
      
      // Add notification
      this.notificationService.addNotification({
        icon: 'local_offer',
        title: 'Parrainage validé',
        message: 'Bonus de 50€ après 50 commandes !',
        time: 'À l\'instant'
      });

      // Show snackbar
      this.snackBar.open('Un bonus de 50€ sera ajouté après 50 commandes', 'Fermer', {
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