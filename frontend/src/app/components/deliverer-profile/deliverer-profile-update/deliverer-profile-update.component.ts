import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
}

@Component({
  selector: 'app-deliverer-profile-update',
  templateUrl: './deliverer-profile-update.component.html',
  styleUrls: ['./deliverer-profile-update.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FormsModule
  ]
})
export class DelivererProfileUpdateComponent implements OnInit {
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
    iban: 'FR76 3000 4028 3798 7654 3210 943'
  };
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        console.log('Données utilisateur reçues pour mise à jour:', user);
        
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
          iban: user.iban || ''
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

  onSave(): void {
    // Validation préliminaire
    if (!this.delivererProfile.firstName || !this.delivererProfile.lastName || !this.delivererProfile.email) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    this.isLoading = true;
    
    console.log('Données du profil à sauvegarder:', this.delivererProfile);
    
    // Préparer les données à envoyer à l'API
    const userData: any = {
      firstName: this.delivererProfile.firstName,
      lastName: this.delivererProfile.lastName,
      email: this.delivererProfile.email,
      address: this.delivererProfile.address,
      phoneNumber: this.delivererProfile.phoneNumber,
      siret: this.delivererProfile.siretNumber ? this.delivererProfile.siretNumber.replace(/\s+/g, '') : '', // Suppression des espaces
      iban: this.delivererProfile.iban ? this.delivererProfile.iban.replace(/\s+/g, '') : '' // Suppression des espaces
    };
    
    // Traitement spécial pour la date de naissance
    try {
      // Format attendu: JJ/MM/AAAA
      if (this.delivererProfile.birthDate && this.delivererProfile.birthDate.includes('/')) {
        const parts = this.delivererProfile.birthDate.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Les mois commencent à 0 en JS
          const year = parseInt(parts[2], 10);
          
          // Vérifier que la date est valide
          if (year > 1900 && year < 2100 && month >= 0 && month < 12 && day > 0 && day <= 31) {
            const date = new Date(year, month, day);
            console.log('Date convertie:', date);
            
            // Format ISO YYYY-MM-DD (sans l'heure/timezone pour éviter les décalages)
            const isoDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            userData.birthDate = isoDate;
            console.log('Date ISO formatée:', isoDate);
          } else {
            console.error('Date invalide: valeurs hors limites');
            this.snackBar.open('Format de date incorrect. Utilisez JJ/MM/AAAA (ex: 01/01/1990)', 'Fermer', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
            this.isLoading = false;
            return; // Arrêter l'envoi
          }
        } else {
          console.error('Format de date incorrect');
          this.snackBar.open('Format de date incorrect. Utilisez JJ/MM/AAAA (ex: 01/01/1990)', 'Fermer', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
          return; // Arrêter l'envoi
        }
      }
    } catch (e) {
      console.error('Erreur lors de la conversion de la date:', e);
      this.snackBar.open('Erreur lors de la conversion de la date', 'Fermer', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
      return; // Arrêter l'envoi
    }

    // Ne pas envoyer le mot de passe s'il n'a pas été modifié
    if (this.delivererProfile.password && this.delivererProfile.password !== '**********') {
      userData['password'] = this.delivererProfile.password;
    }

    // Enregistrer les données du titulaire du compte localement
    localStorage.setItem('accountHolder', this.delivererProfile.accountHolder);
    
    console.log('Données envoyées à l\'API:', userData);

    this.userService.updateUserProfile(userData).subscribe({
      next: (response) => {
        console.log('Réponse de mise à jour:', response);
        this.snackBar.open('Profil mis à jour avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.isLoading = false;
        this.router.navigate(['/deliverer/compte']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        let errorMessage = 'Erreur inconnue';
        
        // Extraction du message d'erreur
        if (error.error && error.error.message) {
          if (Array.isArray(error.error.message)) {
            // Format de validation NestJS
            errorMessage = error.error.message[0];
          } else {
            errorMessage = error.error.message;
          }
          console.error('Message d\'erreur:', errorMessage);
        }
        
        this.snackBar.open(`Erreur: ${errorMessage}`, 'Fermer', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/deliverer/compte']);
  }
} 