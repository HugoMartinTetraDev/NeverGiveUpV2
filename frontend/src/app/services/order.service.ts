import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Order, OrderHistory } from '../models/order.model';
import { CartService } from './cart.service';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private currentOrderSubject = new BehaviorSubject<Order | null>(null);
    public currentOrder$ = this.currentOrderSubject.asObservable();

    constructor(
        private cartService: CartService,
        private apiService: ApiService,
        private notificationService: NotificationService
    ) {}

    /**
     * Récupère toutes les commandes de l'utilisateur connecté
     */
    getOrders(): Observable<Order[]> {
        return this.apiService.get<Order[]>('orders').pipe(
            catchError(error => {
                this.notificationService.error('Erreur lors de la récupération des commandes');
                return throwError(() => error);
            })
        );
    }

    /**
     * Récupère les détails d'une commande par son ID
     */
    getOrderById(orderId: string): Observable<Order> {
        return this.apiService.get<Order>(`orders/${orderId}`).pipe(
            tap(order => this.currentOrderSubject.next(order)),
            catchError(error => {
                this.notificationService.error('Erreur lors de la récupération de la commande');
                return throwError(() => error);
            })
        );
    }

    /**
     * Crée une nouvelle commande
     */
    createOrder(order: Partial<Order>): Observable<Order> {
        return this.apiService.post<Order>('orders', order).pipe(
            tap(newOrder => {
                this.currentOrderSubject.next(newOrder);
                this.notificationService.success('Commande créée avec succès');
                // Vider le panier après création de la commande
                this.cartService.clearCart();
            }),
            catchError(error => {
                this.notificationService.error('Erreur lors de la création de la commande');
                return throwError(() => error);
            })
        );
    }

    /**
     * Met à jour le statut d'une commande
     */
    updateOrderStatus(orderId: string, status: string): Observable<Order> {
        return this.apiService.put<Order>(`orders/${orderId}/status`, { status }).pipe(
            tap(updatedOrder => {
                this.currentOrderSubject.next(updatedOrder);
                this.notificationService.success('Statut de la commande mis à jour');
            }),
            catchError(error => {
                this.notificationService.error('Erreur lors de la mise à jour du statut');
                return throwError(() => error);
            })
        );
    }

    /**
     * Récupère l'historique des commandes de l'utilisateur
     */
    getOrderHistory(): Observable<OrderHistory[]> {
        return this.apiService.get<Order[]>('orders').pipe(
            map(orders => orders.map(order => {
                // Extraction du type de paiement depuis les détails de statut si disponible
                const paymentInfo = order.status.find(s => s.status.includes('Payé'));
                const paymentType = paymentInfo ? 
                    paymentInfo.status.replace('Payé par ', '') : 
                    'Non spécifié';
                
                return {
                    id: +order.id, // Convertir en nombre
                    dateTime: new Date(order.date),
                    amount: order.total,
                    paymentType
                } as OrderHistory;
            })),
            catchError(error => {
                this.notificationService.error('Erreur lors de la récupération de l\'historique');
                return throwError(() => error);
            })
        );
    }

    /**
     * Recrée une commande en ajoutant ses articles au panier
     */
    moveOrderToCart(order: Order): Observable<boolean> {
        if (!order) return of(false);
        
        // Vider le panier existant
        this.cartService.clearCart();
        
        // Ajouter les articles de la commande au panier
        order.items.forEach(item => {
            this.cartService.addToCart({
                id: Date.now().toString(), // Générer un nouvel ID
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            });
        });

        this.notificationService.success('Commande ajoutée au panier');
        return of(true);
    }
} 