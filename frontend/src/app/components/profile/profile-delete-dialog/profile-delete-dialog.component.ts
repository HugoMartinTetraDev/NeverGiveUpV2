import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile-delete-dialog',
  templateUrl: './profile-delete-dialog.component.html',
  styleUrls: ['./profile-delete-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileDeleteDialogComponent {
  isDeleting = false;
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<ProfileDeleteDialogComponent>,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  onConfirm(): void {
    this.isDeleting = true;
    this.errorMessage = '';
    
    // Appel au service pour supprimer le compte
    this.userService.deleteUserAccount().subscribe({
      next: () => {
        // Suppression réussie
        this.isDeleting = false;
        this.snackBar.open('Votre compte a été supprimé avec succès', 'Fermer', {
          duration: 5000
        });
        
        // Déconnexion de l'utilisateur
        this.authService.logout();
        
        // Fermer le dialogue avec un résultat positif
        this.dialogRef.close(true);
      },
      error: (error) => {
        // Erreur lors de la suppression
        this.isDeleting = false;
        console.error('Erreur lors de la suppression du compte:', error);
        
        // Message d'erreur approprié
        if (error.status === 404) {
          this.errorMessage = 'Utilisateur non trouvé';
        } else if (error.status === 401) {
          this.errorMessage = 'Vous devez être connecté pour effectuer cette action';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la suppression de votre compte';
        }
        
        this.snackBar.open(this.errorMessage, 'Fermer', {
          duration: 5000
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 