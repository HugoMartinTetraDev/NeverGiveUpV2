import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, UserRole, AuthResponse } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private apiService: ApiService) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const userData = localStorage.getItem('user_data');
        if (userData) {
          this.currentUserSubject.next(JSON.parse(userData));
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
   * Crée un nouveau compte utilisateur
   */
  register(userData: User): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/register', userData)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => {
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
        tap(response => this.handleAuthentication(response)),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getUserProfile(): Observable<User> {
    return this.apiService.get<User>('users/profile')
      .pipe(
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
    localStorage.setItem('user_data', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
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