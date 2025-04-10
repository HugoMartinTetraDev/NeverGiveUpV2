import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Restaurant } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Test de connexion à l'API - vérifie si l'API est accessible
   */
  pingApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health-check`);
  }

  /**
   * Test d'authentification - vérifie si le token est valide
   */
  testAuth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  /**
   * Test de récupération des restaurants - vérifie si on peut récupérer des données
   */
  testGetRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants`);
  }

  /**
   * Test de récupération d'un restaurant par ID
   */
  testGetRestaurantById(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/restaurants/${id}`);
  }

  /**
   * Affiche les erreurs HTTP dans la console et les renvoie
   */
  logErrorResponse(error: any): void {
    console.error('Erreur de test API:', error);
    console.table({
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.error?.message || error.message
    });
  }
} 