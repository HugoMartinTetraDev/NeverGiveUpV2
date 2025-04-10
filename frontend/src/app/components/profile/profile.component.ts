import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileDeleteDialogComponent } from './profile-delete-dialog/profile-delete-dialog.component';
import { NotificationService } from '../../services/mocked/notification.service';

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
    FormsModule
  ]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = {
    firstName: 'Jhon',
    lastName: 'Doe',
    birthDate: '01/01/2020',
    email: 'cesi@cesi.Fr',
    password: '**************',
    address: '24 Le Paquebot',
    referralCode: '1345-5678'
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
    this.router.navigate(['/compte/modifier']);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ProfileDeleteDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Profile deleted');
        this.router.navigate(['/']);
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