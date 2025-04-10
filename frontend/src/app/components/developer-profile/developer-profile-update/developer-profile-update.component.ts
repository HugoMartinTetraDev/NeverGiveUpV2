import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface DeveloperProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-developer-profile-update',
  templateUrl: './developer-profile-update.component.html',
  styleUrls: ['./developer-profile-update.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule
  ]
})
export class DeveloperProfileUpdateComponent implements OnInit {
  developerProfile: DeveloperProfile = {
    firstName: 'Jhon',
    lastName: 'Doe',
    birthDate: '01/01/2020',
    email: 'cesi@cesi.Fr',
    password: '**********'
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  onSave(): void {
    // Mock successful update
    this.snackBar.open('Profil mis à jour avec succès', 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    this.router.navigate(['/developer/compte']);
  }

  onCancel(): void {
    this.router.navigate(['/developer/compte']);
  }
} 