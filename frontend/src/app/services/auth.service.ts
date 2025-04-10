import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { User, UserRole, AuthResponse } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private tokenRefreshTimer: any;
  private readonly TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes en millisecondes

  constructor(private apiService: ApiService) {
    this.loadStoredUser();
    this.setupTokenRefresh();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const userData = localStorage.getItem('user_data');
        if (userData) {
          const user = JSON.parse(userData);
          // Normaliser le format des rôles
          this.normalizeUserRoles(user);
          this.currentUserSubject.next(user);
        } else {
          // Si nous avons un token mais pas de données utilisateur,
          // nous récupérons le profil de l'utilisateur
          this.getUserProfile().subscribe();
        }
      } catch (e) {
        this.logout();
      }
    }
  }

  /**
   * Normalise le format des rôles utilisateur
   * Assure qu'on a toujours un tableau de rôles
   */
  private normalizeUserRoles(user: User): User {
    if (!user) return user;
    
    // Initialiser les rôles si non existants
    if (!user.roles) {
      user.roles = [];
    }
    
    // Convertir en array si ce n'est pas un tableau
    if (!Array.isArray(user.roles)) {
      user.roles = [user.roles as UserRole];
    }
    
    // Normaliser en majuscules et convertir en UserRole
    user.roles = user.roles.map(role => {
      const roleUpperCase = String(role).toUpperCase();
      return roleUpperCase as UserRole;
    });
    
    // Définir le rôle primaire s'il n'existe pas déjà
    if (!user.primaryRole && user.roles.length > 0) {
      user.primaryRole = user.roles[0];
    }
    
    return user;
  }

  /**
   * Configure le rafraîchissement automatique du token
   */
  private setupTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
    }

    // Rafraîchir le token toutes les 14 minutes (avant qu'il n'expire à 15 minutes)
    this.tokenRefreshTimer = setInterval(() => {
      if (this.isLoggedIn) {
        console.log('Rafraîchissement automatique du token...');
        this.refreshToken().subscribe({
          next: () => console.log('Token rafraîchi avec succès'),
          error: (error) => {
            console.error('Échec du rafraîchissement du token:', error);
            // Si le rafraîchissement échoue, nous déconnectons l'utilisateur
            this.logout();
          }
        });
      }
    }, this.TOKEN_REFRESH_INTERVAL);
  }

  /**
   * Crée un nouveau compte utilisateur
   */
  register(userData: User): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/register', userData)
      .pipe(
        map(response => {
          // Normaliser le format des rôles
          if (response.user) {
            response.user = this.normalizeUserRoles(response.user);
          }
          return response;
        }),
        tap(response => this.handleAuthentication(response)),
        catchError(error => {
          console.error('Erreur d\'inscription détaillée:', error);
          
          // Enrichir l'erreur avec un message plus explicite si nécessaire
          if (error.status === 400) {
            if (!error.error.message) {
              error.error.message = 'Veuillez vérifier les informations saisies et réessayer.';
            }
          }
          
          return throwError(() => error);
        })
      );
  }

  /**
   * Connecte un utilisateur avec ses identifiants
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/login', { email, password })
      .pipe(
        map(response => {
          // Normaliser le format des rôles
          if (response.user) {
            response.user = this.normalizeUserRoles(response.user);
          }
          return response;
        }),
        tap(response => this.handleAuthentication(response)),
        catchError(error => {
          console.error('Erreur d\'authentification détaillée:', error);
          
          // Enrichir l'erreur avec un message plus explicite
          if (error.status === 401) {
            error.message = 'Identifiant ou mot de passe incorrect';
          } else if (error.status === 0) {
            error.message = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
          }
          
          return throwError(() => error);
        })
      );
  }

  /**
   * Rafraîchit le token d'accès en utilisant le refresh token
   */
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return throwError(() => new Error('Pas de token de rafraîchissement disponible'));
    }

    return this.apiService.post<any>('auth/refresh', { refreshToken })
      .pipe(
        map(response => {
          // Normaliser le format des rôles
          if (response.user) {
            response.user = this.normalizeUserRoles(response.user);
          }
          return response;
        }),
        tap(response => {
          // Mettre à jour seulement le token d'accès, pas le refresh token
          localStorage.setItem(this.TOKEN_KEY, response.token);
          if (response.user) {
            localStorage.setItem('user_data', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Erreur lors du rafraîchissement du token:', error);
          // En cas d'erreur de rafraîchissement, déconnecter l'utilisateur
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getUserProfile(): Observable<User> {
    return this.apiService.post<User>('auth/profile', {})
      .pipe(
        map(user => this.normalizeUserRoles(user)),
        tap(user => {
          localStorage.setItem('user_data', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          // Si erreur 401, on déconnecte l'utilisateur
          if (error.status === 401) {
            this.logout();
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Gère l'authentification après login/register
   */
  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    
    // Stocker le refresh token s'il est présent
    if (response.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    }
    
    // Stocker les données utilisateur
    if (response.user) {
      localStorage.setItem('user_data', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
    
    // Configurer le rafraîchissement de token
    this.setupTokenRefresh();
  }

  /**
   * Met à jour les données utilisateur stockées
   */
  refreshUserData(user: User): void {
    // Normaliser le format des rôles
    user = this.normalizeUserRoles(user);
    
    localStorage.setItem('user_data', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    // Arrêter le rafraîchissement du token
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
    
    // Supprimer les tokens et les données utilisateur
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  /**
   * Purge et réinitialise le stockage local des données utilisateur
   * Utile en cas de données utilisateur corrompues ou de problèmes d'authentification
   */
  resetLocalStorage(): void {
    console.log('Réinitialisation du stockage local...');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem('user_data');
    
    // Réinitialiser l'utilisateur courant
    this.currentUserSubject.next(null);
    
    // Arrêter le rafraîchissement du token
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
    
    console.log('Stockage local réinitialisé avec succès');
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
} 