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
  // Champs spécifiques au livreur
  siretNumber?: string; // Alias utilisé côté client pour siret
  siret?: string;  // Nom du champ utilisé dans le backend
  accountHolder?: string;  // Champ utilisé uniquement côté client, non stocké dans le backend
  iban?: string;
  referredBy?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
} 