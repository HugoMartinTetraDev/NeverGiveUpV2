import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Exécute une requête GET
   * @param endpoint le chemin de l'API après la base URL
   * @param params paramètres optionnels
   * @param headers headers optionnels
   */
  get<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T> {
    const options = {
      params: new HttpParams({ fromObject: params || {} }),
      headers
    };
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, options);
  }

  /**
   * Exécute une requête POST
   * @param endpoint le chemin de l'API après la base URL
   * @param body corps de la requête
   * @param headers headers optionnels
   */
  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, { headers });
  }

  /**
   * Exécute une requête PUT
   * @param endpoint le chemin de l'API après la base URL
   * @param body corps de la requête
   * @param headers headers optionnels
   */
  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    console.log(`APIService: PUT ${this.apiUrl}/${endpoint}`, body);
    
    // Assurez-vous d'avoir les headers d'autorisation si disponibles
    const token = localStorage.getItem('auth_token');
    const authHeaders = headers || new HttpHeaders();
    
    if (token) {
      const headersWithAuth = authHeaders.set('Authorization', `Bearer ${token}`);
      return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, { headers: headersWithAuth });
    }
    
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, { headers });
  }

  /**
   * Exécute une requête DELETE
   * @param endpoint le chemin de l'API après la base URL
   * @param headers headers optionnels
   */
  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, { headers });
  }
} 