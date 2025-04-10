import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TestService } from '../../services/test.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule
  ],
  template: `
    <div class="test-container">
      <h1>Test des services API</h1>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Tests d'authentification</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-row">
            <span>Statut connexion:</span>
            <span [class]="isLoggedIn ? 'success' : 'error'">
              {{ isLoggedIn ? 'Connecté' : 'Non connecté' }}
            </span>
          </div>
          
          <div class="token-info" *ngIf="token">
            <h4>Token JWT:</h4>
            <code>{{ tokenPreview }}</code>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="testAuth()" [disabled]="authLoading">
            <mat-spinner diameter="20" *ngIf="authLoading"></mat-spinner>
            <span *ngIf="!authLoading">Tester l'authentification</span>
          </button>
        </mat-card-actions>
      </mat-card>
      
      <mat-divider></mat-divider>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Tests de récupération de données</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="dataLoading" class="loading">
            <mat-spinner diameter="30"></mat-spinner>
            <span>Chargement des données...</span>
          </div>
          
          <div *ngIf="!dataLoading && restaurants.length === 0" class="no-data">
            <mat-icon>info</mat-icon>
            <span>Aucun restaurant trouvé</span>
          </div>
          
          <div *ngIf="!dataLoading && restaurants.length > 0" class="data-results">
            <h4>Restaurants ({{ restaurants.length }}):</h4>
            <ul>
              <li *ngFor="let restaurant of restaurants">
                {{ restaurant.name }}
                <button mat-button color="primary" (click)="loadRestaurantDetails(restaurant.id)">
                  Détails
                </button>
              </li>
            </ul>
          </div>
          
          <div *ngIf="selectedRestaurant" class="restaurant-details">
            <h4>Détails du restaurant:</h4>
            <p><strong>Nom:</strong> {{ selectedRestaurant.name }}</p>
            <p><strong>Description:</strong> {{ selectedRestaurant.description || 'Aucune description' }}</p>
            <p><strong>Menus:</strong> {{ selectedRestaurant.menus.length }}</p>
            <p><strong>Articles:</strong> {{ selectedRestaurant.articles.length }}</p>
          </div>
          
          <div *ngIf="dataError" class="error-message">
            <mat-icon>error</mat-icon>
            <span>{{ dataError }}</span>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="loadRestaurants()" [disabled]="dataLoading">
            <mat-spinner diameter="20" *ngIf="dataLoading"></mat-spinner>
            <span *ngIf="!dataLoading">Tester la récupération des restaurants</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    mat-card {
      margin-bottom: 20px;
    }
    
    .status-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .status-row span:first-child {
      margin-right: 10px;
      font-weight: bold;
    }
    
    .success {
      color: green;
      font-weight: bold;
    }
    
    .error {
      color: red;
      font-weight: bold;
    }
    
    .token-info {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    code {
      word-break: break-all;
    }
    
    .loading, .no-data, .error-message {
      display: flex;
      align-items: center;
      margin: 20px 0;
    }
    
    .loading mat-spinner, .no-data mat-icon, .error-message mat-icon {
      margin-right: 10px;
    }
    
    .error-message {
      color: red;
    }
    
    .restaurant-details {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    ul {
      list-style-type: none;
      padding: 0;
    }
    
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  isLoggedIn = false;
  token: string | null = null;
  tokenPreview = '';
  
  authLoading = false;
  dataLoading = false;
  
  restaurants: Restaurant[] = [];
  selectedRestaurant: Restaurant | null = null;
  dataError: string | null = null;

  constructor(
    private testService: TestService,
    private authService: AuthService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.token = this.authService.token;
    
    if (this.token) {
      // Afficher une version tronquée du token pour la sécurité
      this.tokenPreview = this.token.substring(0, 20) + '...' + this.token.substring(this.token.length - 10);
    }
  }

  testAuth(): void {
    this.authLoading = true;
    this.testService.testAuth().subscribe({
      next: (response) => {
        console.log('Test auth réussi:', response);
        this.authLoading = false;
        this.isLoggedIn = true;
      },
      error: (error) => {
        this.testService.logErrorResponse(error);
        this.authLoading = false;
        this.isLoggedIn = false;
      }
    });
  }

  loadRestaurants(): void {
    this.dataLoading = true;
    this.dataError = null;
    this.restaurants = [];
    this.selectedRestaurant = null;
    
    this.testService.testGetRestaurants().subscribe({
      next: (restaurants) => {
        this.restaurants = restaurants;
        this.dataLoading = false;
      },
      error: (error) => {
        this.testService.logErrorResponse(error);
        this.dataError = `Erreur: ${error.status} - ${error.statusText || 'Problème de connexion'}`;
        this.dataLoading = false;
      }
    });
  }

  loadRestaurantDetails(id: string): void {
    this.dataLoading = true;
    this.dataError = null;
    
    this.testService.testGetRestaurantById(id).subscribe({
      next: (restaurant) => {
        this.selectedRestaurant = restaurant;
        this.dataLoading = false;
      },
      error: (error) => {
        this.testService.logErrorResponse(error);
        this.dataError = `Erreur: ${error.status} - ${error.statusText || 'Problème de connexion'}`;
        this.dataLoading = false;
      }
    });
  }
} 