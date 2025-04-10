import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Profile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'restaurateur' | 'deliverer' | 'developer' | 'commercial';
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private mockProfiles: Profile[] = [
    {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'customer',
      phoneNumber: '+1234567890',
      address: '123 Main St, City',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      username: 'restaurant_owner',
      email: 'owner@restaurant.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'restaurateur',
      phoneNumber: '+1987654321',
      address: '456 Restaurant Ave, City',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() { }

  getProfile(id: string): Observable<Profile | undefined> {
    return of(this.mockProfiles.find(profile => profile.id === id));
  }

  getCurrentProfile(): Observable<Profile | undefined> {
    // Mock getting current user's profile
    return of(this.mockProfiles[0]);
  }

  updateProfile(profile: Profile): Observable<Profile> {
    const index = this.mockProfiles.findIndex(p => p.id === profile.id);
    if (index !== -1) {
      this.mockProfiles[index] = { ...profile, updatedAt: new Date() };
    }
    return of(profile);
  }

  getAllProfiles(): Observable<Profile[]> {
    return of(this.mockProfiles);
  }

  getProfilesByRole(role: Profile['role']): Observable<Profile[]> {
    return of(this.mockProfiles.filter(profile => profile.role === role));
  }
} 