import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RestaurateurOrder } from '../models/restaurateur-order.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurateurOrdersService {
  // Mock data for current orders
  private currentOrders: RestaurateurOrder[] = [
    {
      id: 7,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Classic Burger',
      status: 'En attente'
    },
    {
      id: 8,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Classic Burger Menu',
      status: 'En attente'
    },
    {
      id: 9,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Classic Burger Menu',
      status: 'Livraison en cours'
    },
    {
      id: 10,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Classic Burger',
      status: 'En attente de réception'
    },
    {
      id: 11,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Frites',
      status: 'Préparation en cours'
    },
    {
      id: 12,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Frites',
      status: 'Préparation en cours'
    }
  ];

  // Mock data for order history
  private orderHistory: RestaurateurOrder[] = [
    {
      id: 1,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Classic Burger',
      status: 'Terminée',
      amount: 12.00
    },
    {
      id: 2,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Classic Burger Menu',
      status: 'Terminée',
      amount: 26.00
    },
    {
      id: 3,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Frites',
      status: 'Terminée',
      amount: 32.99
    },
    {
      id: 4,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Classic Burger',
      status: 'Terminée',
      amount: 56.26
    },
    {
      id: 5, 
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Classic Burger Menu',
      status: 'Terminée',
      amount: 48.25
    },
    {
      id: 6,
      date: new Date('2025-03-21T08:50:46'),
      articles: 'Frites',
      status: 'Terminée',
      amount: 58.26
    }
  ];

  constructor() { }

  /**
   * Get all current orders
   */
  getCurrentOrders(): Observable<RestaurateurOrder[]> {
    return of(this.currentOrders);
  }

  /**
   * Get order history
   */
  getOrderHistory(): Observable<RestaurateurOrder[]> {
    return of(this.orderHistory);
  }

  /**
   * Validate an order by changing its status
   */
  validateOrder(orderId: number): Observable<boolean> {
    const orderIndex = this.currentOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      // Update the status to next step (could be more complex in a real app)
      if (this.currentOrders[orderIndex].status === 'En attente') {
        this.currentOrders[orderIndex].status = 'Préparation en cours';
        return of(true);
      }
    }
    
    return of(false);
  }

  /**
   * Mark an order as ready by changing its status to "En attente de réception"
   */
  markAsReady(orderId: number): Observable<boolean> {
    const orderIndex = this.currentOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      if (this.currentOrders[orderIndex].status === 'Préparation en cours') {
        this.currentOrders[orderIndex].status = 'En attente de réception';
        return of(true);
      }
    }
    
    return of(false);
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: number): Observable<boolean> {
    const orderIndex = this.currentOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      // Remove the order from current orders and add it to history with canceled status
      const canceledOrder = {
        ...this.currentOrders[orderIndex],
        status: 'Annulée'
      };
      this.orderHistory.unshift(canceledOrder);
      this.currentOrders.splice(orderIndex, 1);
      return of(true);
    }
    
    return of(false);
  }
} 