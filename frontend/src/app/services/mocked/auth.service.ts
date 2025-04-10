import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserRole, AuthResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const userData = localStorage.getItem('user_data');
        if (userData) {
          this.currentUserSubject.next(JSON.parse(userData));
        }
      } catch (e) {
        this.logout();
      }
    }
  }

  // Mock implementation for local development
  register(userData: User): Observable<AuthResponse> {
    // Add a fake ID and dates to simulate a backend response
    const user: User = {
      ...userData,
      id: Date.now(), // Use timestamp as numeric ID
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const response: AuthResponse = {
      user,
      token: 'fake-token-' + Math.random().toString(36).substring(2)
    };
    
    // Simulate API delay
    return of(response).pipe(
      delay(500), // Delay to simulate network request
    );
  }

  // Mock implementation for local development
  login(email: string, password: string): Observable<AuthResponse> {
    // Hardcoded mock user for testing
    const user: User = {
      id: Date.now(), // Use timestamp as numeric ID
      email,
      firstName: 'Test',
      lastName: 'User',
      roles: [UserRole.CUSTOMER],
      createdAt: new Date(),
      updatedAt: new Date(),
      birthDate: new Date(),
      address: '',
      referralCode: '',
      status: 'Actif'
    };
    
    const response: AuthResponse = {
      user,
      token: 'fake-token-' + Math.random().toString(36).substring(2)
    };
    
    // Save to localStorage to simulate persistence
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem('user_data', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Simulate API delay
    return of(response).pipe(
      delay(500), // Delay to simulate network request
    );
  }

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