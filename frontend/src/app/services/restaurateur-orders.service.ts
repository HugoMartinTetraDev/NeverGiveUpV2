import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { RestaurateurOrder } from '../models/restaurateur-order.model';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurateurOrdersService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  /**
   * Get all current orders from the API
   */
  getCurrentOrders(): Observable<RestaurateurOrder[]> {
    this.isLoadingSubject.next(true);
    return this.apiService.get<any[]>('restaurants/my-restaurant/orders').pipe(
      map(orders => {
        // Vérifier si orders est défini et est un tableau
        if (!orders || !Array.isArray(orders)) {
          console.warn('Invalid orders data received:', orders);
          return [];
        }
        
        // Filtrer pour n'avoir que les commandes en cours (pas terminées ni annulées)
        return orders
          .filter(order => 
            order && order.status && 
            order.status !== 'DELIVERED' && 
            order.status !== 'CANCELED')
          .map(order => this.mapToRestaurateurOrder(order))
          .filter((order): order is RestaurateurOrder => order !== null); // Type guard
      }),
      finalize(() => this.isLoadingSubject.next(false)),
      catchError(error => {
        console.error('Error fetching current orders:', error);
        this.notificationService.error('Erreur lors de la récupération des commandes');
        return of([]);
      })
    );
  }

  /**
   * Get order history from the API
   */
  getOrderHistory(): Observable<RestaurateurOrder[]> {
    this.isLoadingSubject.next(true);
    return this.apiService.get<any[]>('restaurants/my-restaurant/orders').pipe(
      map(orders => {
        // Vérifier si orders est défini et est un tableau
        if (!orders || !Array.isArray(orders)) {
          console.warn('Invalid orders data received:', orders);
          return [];
        }
        
        // Filtrer pour n'avoir que les commandes terminées ou annulées
        return orders
          .filter(order => 
            order && order.status && 
            (order.status === 'DELIVERED' || order.status === 'CANCELED'))
          .map(order => this.mapToRestaurateurOrder(order))
          .filter((order): order is RestaurateurOrder => order !== null); // Type guard
      }),
      finalize(() => this.isLoadingSubject.next(false)),
      catchError(error => {
        console.error('Error fetching order history:', error);
        this.notificationService.error('Erreur lors de la récupération de l\'historique des commandes');
        return of([]);
      })
    );
  }

  /**
   * Validate an order by changing its status
   */
  validateOrder(orderId: number): Observable<boolean> {
    if (!orderId) {
      console.error('Invalid order ID for validation:', orderId);
      this.notificationService.error('ID de commande invalide');
      return of(false);
    }
    
    this.isLoadingSubject.next(true);
    return this.apiService.put<any>(`orders/${orderId}/status`, { status: 'ACCEPTED' }).pipe(
      map(() => true),
      finalize(() => this.isLoadingSubject.next(false)),
      tap(() => {
        this.notificationService.success('Commande validée avec succès');
      }),
      catchError(error => {
        console.error('Error validating order:', error);
        this.notificationService.error('Erreur lors de la validation de la commande');
        return of(false);
      })
    );
  }

  /**
   * Mark an order as ready by changing its status
   */
  markAsReady(orderId: number): Observable<boolean> {
    if (!orderId) {
      console.error('Invalid order ID for marking as ready:', orderId);
      this.notificationService.error('ID de commande invalide');
      return of(false);
    }
    
    this.isLoadingSubject.next(true);
    return this.apiService.put<any>(`orders/${orderId}/status`, { status: 'READY' }).pipe(
      map(() => true),
      finalize(() => this.isLoadingSubject.next(false)),
      tap(() => {
        this.notificationService.success('Commande marquée comme prête');
      }),
      catchError(error => {
        console.error('Error marking order as ready:', error);
        this.notificationService.error('Erreur lors de la mise à jour du statut de la commande');
        return of(false);
      })
    );
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: number): Observable<boolean> {
    if (!orderId) {
      console.error('Invalid order ID for cancellation:', orderId);
      this.notificationService.error('ID de commande invalide');
      return of(false);
    }
    
    this.isLoadingSubject.next(true);
    return this.apiService.put<any>(`orders/${orderId}/status`, { status: 'CANCELED' }).pipe(
      map(() => true),
      finalize(() => this.isLoadingSubject.next(false)),
      tap(() => {
        this.notificationService.success('Commande annulée avec succès');
      }),
      catchError(error => {
        console.error('Error canceling order:', error);
        this.notificationService.error('Erreur lors de l\'annulation de la commande');
        return of(false);
      })
    );
  }

  /**
   * Helper method to map API response to RestaurateurOrder model
   */
  private mapToRestaurateurOrder(order: any): RestaurateurOrder | null {
    try {
      if (!order || !order.id) {
        console.warn('Invalid order data:', order);
        return null;
      }
      
      // Vérifier et créer la liste des articles commandés
      let articlesList = 'Articles non disponibles';
      if (order.orderItems && Array.isArray(order.orderItems)) {
        const itemTexts = order.orderItems
          .filter((item: any) => item && item.quantity && item.article && item.article.name)
          .map((item: { quantity: number; article: { name: string } }) => 
            `${item.quantity}x ${item.article.name}`
          );
          
        articlesList = itemTexts.length > 0 ? itemTexts.join(', ') : 'Aucun article';
      }
      
      // Mapper le statut API vers un texte français plus convivial
      const statusMap: { [key: string]: string } = {
        'PENDING': 'En attente',
        'ACCEPTED': 'Préparation en cours',
        'IN_PROGRESS': 'Préparation en cours',
        'READY': 'En attente de réception',
        'DELIVERED': 'Terminée',
        'CANCELED': 'Annulée'
      };

      // Assurer que l'ID peut être converti en nombre
      let orderId: number;
      try {
        orderId = typeof order.id === 'number' ? order.id : Number(order.id);
        if (isNaN(orderId)) {
          console.warn('Invalid order ID:', order.id);
          return null;
        }
      } catch (e) {
        console.warn('Error converting order ID:', order.id);
        return null;
      }
      
      // Assurer que la date est valide
      let orderDate: Date;
      try {
        const dateString = order.createdAt || (order.timestamps && order.timestamps.created);
        orderDate = dateString ? new Date(dateString) : new Date();
        if (isNaN(orderDate.getTime())) {
          console.warn('Invalid date, using current date instead');
          orderDate = new Date();
        }
      } catch (e) {
        console.warn('Error parsing date, using current date instead');
        orderDate = new Date();
      }
      
      // Créer et retourner l'objet RestaurateurOrder
      return {
        id: orderId,
        date: orderDate,
        articles: articlesList,
        status: order.status && statusMap[order.status] ? statusMap[order.status] : 'Statut inconnu',
        amount: typeof order.totalAmount === 'number' ? order.totalAmount : null
      };
    } catch (error) {
      console.error('Error mapping order data:', error, order);
      return null;
    }
  }
} 