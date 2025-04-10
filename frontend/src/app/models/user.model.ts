export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_OWNER = 'restaurantOwner',
  DELIVERER = 'deliverer',
  DEVELOPER = 'developer'
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
} 