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

interface DeveloperProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-developer-profile',
  templateUrl: './developer-profile.component.html',
  styleUrls: ['./developer-profile.component.scss'],
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
export class DeveloperProfileComponent implements OnInit {
  developerProfile: DeveloperProfile = {
    firstName: 'Jhon',
    lastName: 'Doe',
    birthDate: '01/01/2020',
    email: 'cesi@cesi.Fr',
    password: '**********'
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void { }

  onModify(): void {
    this.router.navigate(['/developer/compte/modifier']);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ProfileDeleteDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Developer profile deleted');
        this.router.navigate(['/']);
      }
    });
  }
} 