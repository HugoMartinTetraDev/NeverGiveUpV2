import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { RestaurateurOrder } from '../models/restaurateur-order.model';
import { RestaurateurOrdersService } from './restaurateur-orders.service';

@Injectable({
  providedIn: 'root'
})
export class MockRestaurateurOrdersService extends RestaurateurOrdersService {
  private mockCurrentOrders: RestaurateurOrder[] = [
    {
      id: 1,
      date: new Date('2024-04-10T12:30:00'),
      articles: '2x Big Burger, 1x Frites, 2x Coca-Cola',
      status: 'En attente',
      amount: 24.97
    },
    {
      id: 2,
      date: new Date('2024-04-10T12:45:00'),
      articles: '1x Menu Royal, 1x Onion Rings',
      status: 'Préparation en cours',
      amount: 20.98
    },
    {
      id: 3,
      date: new Date('2024-04-10T13:00:00'),
      articles: '3x Classic Burger, 2x Frites',
      status: 'En attente',
      amount: 32.95
    }
  ];

  private mockOrderHistory: RestaurateurOrder[] = [
    {
      id: 4,
      date: new Date('2024-04-09T19:30:00'),
      articles: '1x Menu American, 1x Milkshake',
      status: 'Terminée',
      amount: 18.98
    },
    {
      id: 5,
      date: new Date('2024-04-09T18:45:00'),
      articles: '2x Royal Burger, 1x Onion Rings',
      status: 'Terminée',
      amount: 30.97
    },
    {
      id: 6,
      date: new Date('2024-04-08T20:15:00'),
      articles: '1x Menu Quipique, 2x Coca-Cola',
      status: 'Annulée',
      amount: 19.97
    }
  ];

  override getCurrentOrders(): Observable<RestaurateurOrder[]> {
    return of([...this.mockCurrentOrders]).pipe(delay(300));
  }

  override getOrderHistory(): Observable<RestaurateurOrder[]> {
    return of([...this.mockOrderHistory]).pipe(delay(300));
  }

  override validateOrder(orderId: number): Observable<boolean> {
    const order = this.mockCurrentOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'Préparation en cours';
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  override markAsReady(orderId: number): Observable<boolean> {
    const order = this.mockCurrentOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'En attente de réception';
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  override cancelOrder(orderId: number): Observable<boolean> {
    const orderIndex = this.mockCurrentOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      const [order] = this.mockCurrentOrders.splice(orderIndex, 1);
      const cancelledOrder: RestaurateurOrder = {
        ...order,
        status: 'Annulée'
      };
      this.mockOrderHistory.unshift(cancelledOrder);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
} 