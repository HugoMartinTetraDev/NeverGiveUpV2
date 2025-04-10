import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CommercialUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'commercial';
  territory: string;
  commission: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommercialOrder {
  id: string;
  commercialId: string;
  restaurantId: string;
  orderId: string;
  commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CommercialService {
  private mockCommercialUsers: CommercialUser[] = [
    {
      id: '1',
      username: 'commercial1',
      email: 'commercial1@example.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      role: 'commercial',
      territory: 'North Region',
      commission: 0.05,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private mockCommercialOrders: CommercialOrder[] = [
    {
      id: '1',
      commercialId: '1',
      restaurantId: '1',
      orderId: '1',
      commission: 5.99,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() { }

  getCommercialUsers(): Observable<CommercialUser[]> {
    return of(this.mockCommercialUsers);
  }

  getCommercialUser(id: string): Observable<CommercialUser | undefined> {
    return of(this.mockCommercialUsers.find(user => user.id === id));
  }

  createCommercialUser(user: Omit<CommercialUser, 'id' | 'createdAt' | 'updatedAt'>): Observable<CommercialUser> {
    const newUser: CommercialUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockCommercialUsers.push(newUser);
    return of(newUser);
  }

  updateCommercialUser(user: CommercialUser): Observable<CommercialUser> {
    const index = this.mockCommercialUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.mockCommercialUsers[index] = { ...user, updatedAt: new Date() };
    }
    return of(user);
  }

  getCommercialOrders(commercialId: string): Observable<CommercialOrder[]> {
    return of(this.mockCommercialOrders.filter(order => order.commercialId === commercialId));
  }

  createCommercialOrder(order: Omit<CommercialOrder, 'id' | 'createdAt' | 'updatedAt'>): Observable<CommercialOrder> {
    const newOrder: CommercialOrder = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockCommercialOrders.push(newOrder);
    return of(newOrder);
  }

  updateCommercialOrderStatus(orderId: string, status: CommercialOrder['status']): Observable<CommercialOrder | undefined> {
    const order = this.mockCommercialOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      return of(order);
    }
    return of(undefined);
  }

  calculateCommission(amount: number, commissionRate: number): number {
    return amount * commissionRate;
  }
} 