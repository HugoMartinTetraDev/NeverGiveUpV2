import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-storage-reset',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
  template: `
    <mat-card class="reset-card">
      <mat-card-header>
        <mat-card-title>Réinitialisation du stockage local</mat-card-title>
        <mat-card-subtitle>Utile en cas de problèmes d'authentification ou d'affichage</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>
          Cette fonctionnalité permet de résoudre les problèmes liés à un stockage local corrompu, 
          notamment les problèmes d'affichage de la barre latérale ou de permissions incorrectes.
        </p>
        <p>
          <strong>Attention :</strong> Cette action vous déconnectera et vous devrez vous reconnecter.
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="warn" (click)="resetStorage()">
          <mat-icon>delete_forever</mat-icon>
          Réinitialiser le stockage local
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .reset-card {
      max-width: 600px;
      margin: 20px auto;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
    }
  `]
})
export class StorageResetComponent {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  resetStorage(): void {
    // Réinitialiser le stockage local
    this.authService.resetLocalStorage();
    
    // Afficher un message de confirmation
    this.snackBar.open(
      'Stockage local réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.',
      'OK',
      { duration: 5000 }
    );
    
    // Rediriger vers la page de connexion après un court délai
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
} 