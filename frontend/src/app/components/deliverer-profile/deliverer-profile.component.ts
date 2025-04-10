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

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void { }

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
        console.log('Deliverer profile deleted');
        this.router.navigate(['/']);
      }
    });
  }

  onConfirmReferral(): void {
    if (this.friendReferralCode === '1234-5648') {
      this.referralSuccess = true;
      this.referralMessage = 'Code de parrainage validé avec succès !';
      
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
    } else {
      this.referralSuccess = false;
      this.referralMessage = 'Code de parrainage invalide';
    }
  }
} 