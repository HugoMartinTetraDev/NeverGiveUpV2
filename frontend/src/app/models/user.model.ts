export enum UserRole {
  CLIENT = 'CLIENT',
  RESTAURATEUR = 'RESTAURATEUR',
  LIVREUR = 'LIVREUR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  address: string;
  referralCode: string;
  status: 'Actif' | 'Suspendu';
  roles: UserRole[];
  primaryRole?: UserRole;
  password?: string;
  phoneNumber?: string;
  city?: string;
  zipCode?: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
} 