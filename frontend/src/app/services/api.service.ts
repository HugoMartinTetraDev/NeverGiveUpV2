import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private httpHandler: HttpHandler;

  constructor(private http: HttpClient) {
    // Récupérer le HttpHandler pour les appels directs sans intercepteurs
    this.httpHandler = http instanceof HttpHandler ? http : (http as any).handler;
  }

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
    
    const url = this.formatUrl(endpoint);
    console.log(`API GET: ${url}`);
    
    return this.http.get<T>(url, options).pipe(
      catchError(error => this.handleError(error, 'GET', endpoint))
    );
  }

  /**
   * Exécute une requête POST
   * @param endpoint le chemin de l'API après la base URL
   * @param body corps de la requête
   * @param headers headers optionnels
   */
  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const url = this.formatUrl(endpoint);
    console.log(`API POST: ${url}`, body);
    
    return this.http.post<T>(url, body, { headers }).pipe(
      catchError(error => this.handleError(error, 'POST', endpoint))
    );
  }

  /**
   * Exécute une requête PUT
   * @param endpoint le chemin de l'API après la base URL
   * @param body corps de la requête
   * @param headers headers optionnels
   */
  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const url = this.formatUrl(endpoint);
    console.log(`API PUT: ${url}`, body);
    
    // Assurez-vous d'avoir les headers d'autorisation si disponibles
    const token = localStorage.getItem('auth_token');
    let requestHeaders = headers || new HttpHeaders();
    
    if (token) {
      requestHeaders = requestHeaders.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('Token non trouvé pour la requête PUT');
    }
    
    // Toujours utiliser les headers avec le token s'il est disponible
    return this.http.put<T>(url, body, { 
      headers: requestHeaders 
    }).pipe(
      catchError(error => this.handleError(error, 'PUT', endpoint))
    );
  }

  /**
   * Exécute une requête DELETE
   * @param endpoint le chemin de l'API après la base URL
   * @param headers headers optionnels
   */
  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    const url = this.formatUrl(endpoint);
    console.log(`API DELETE: ${url}`);
    
    return this.http.delete<T>(url, { headers }).pipe(
      catchError(error => this.handleError(error, 'DELETE', endpoint))
    );
  }

  /**
   * Effectue une requête PATCH
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    const url = this.formatUrl(endpoint);
    console.log(`API PATCH: ${url}`, data);
    
    return this.http.patch<T>(url, data).pipe(
      catchError(error => this.handleError(error, 'PATCH', endpoint))
    );
  }

  /**
   * Effectue une requête HTTP directe sans passer par les intercepteurs
   * Utilisé principalement pour les logs afin d'éviter les boucles infinies
   */
  sendDirectRequest<T>(request: HttpRequest<any>): Observable<T> {
    // Modifier l'URL pour inclure l'URL de base de l'API si nécessaire
    if (!request.url.startsWith('http')) {
      const url = this.formatUrl(request.url);
      request = request.clone({ url });
    }
    
    // Exécuter la requête directement avec le handler, sans passer par les intercepteurs
    return this.httpHandler.handle(request) as Observable<any>;
  }

  /**
   * Formate l'URL en s'assurant qu'il n'y a pas de doubles slashes
   */
  private formatUrl(endpoint: string): string {
    // Supprimer les slashes au début de l'endpoint et à la fin de l'apiUrl
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const cleanApiUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
    
    return `${cleanApiUrl}/${cleanEndpoint}`;
  }

  /**
   * Gère les erreurs HTTP de manière uniforme
   */
  private handleError(error: HttpErrorResponse, method: string, endpoint: string) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code: ${error.status}, Message: ${error.message}`;
      
      // Ajouter des détails supplémentaires si disponibles
      if (error.error?.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }
    
    console.error(`API Error (${method} ${endpoint}):`, errorMessage, error);
    return throwError(() => error);
  }
} 