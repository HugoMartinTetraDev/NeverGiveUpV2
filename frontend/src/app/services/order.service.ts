import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Order, OrderHistory, OrderItem } from '../models/order.model';
import { CartService, CartItem } from './cart.service';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private currentOrderSubject = new BehaviorSubject<Order | null>(null);
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public currentOrder$ = this.currentOrderSubject.asObservable();
    public isLoading$ = this.isLoadingSubject.asObservable();

    private orderTotal = new BehaviorSubject<number>(0);
    currentOrderTotal = this.orderTotal.asObservable();

    // Mock order data
    private mockOrders: Order[] = [
        {
            id: '1',
            date: new Date(),
            items: [
                {
                    name: 'Pizza Margherita',
                    price: 12.99,
                    quantity: 2,
                    image: 'assets/images/pizza-margherita.jpg'
                },
                {
                    name: 'Coca-Cola',
                    price: 2.99,
                    quantity: 1,
                    image: 'assets/images/coca-cola.jpg'
                }
            ],
            subtotal: 28.97,
            fees: {
                amount: 2.90,
                percentage: 10
            },
            total: 31.87,
            status: [
                {
                    status: 'En préparation',
                    timestamp: new Date().toISOString()
                }
            ]
        }
    ];

    constructor(
        private cartService: CartService,
        private apiService: ApiService,
        private notificationService: NotificationService
    ) {}

    /**
     * Récupère l'ordre courant - méthode pour compatibilité avec les composants existants
     */
    getCurrentOrder(): Observable<Order | null> {
        return this.currentOrder$;
    }

    /**
     * Récupère toutes les commandes de l'utilisateur connecté
     */
    getOrders(): Observable<Order[]> {
        this.isLoadingSubject.next(true);
        return this.apiService.get<Order[]>('orders').pipe(
            finalize(() => this.isLoadingSubject.next(false)),
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
        this.isLoadingSubject.next(true);
        return this.apiService.get<Order>(`orders/${orderId}`).pipe(
            tap(order => this.currentOrderSubject.next(order)),
            finalize(() => this.isLoadingSubject.next(false)),
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
        this.isLoadingSubject.next(true);
        return this.apiService.post<Order>('orders', order).pipe(
            tap(newOrder => {
                this.currentOrderSubject.next(newOrder);
                this.notificationService.success('Commande créée avec succès');
                // Vider le panier après création de la commande
                this.cartService.clearCart();
            }),
            finalize(() => this.isLoadingSubject.next(false)),
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
        this.isLoadingSubject.next(true);
        return this.apiService.put<Order>(`orders/${orderId}/status`, { status }).pipe(
            tap(updatedOrder => {
                this.currentOrderSubject.next(updatedOrder);
                this.notificationService.success('Statut de la commande mis à jour');
            }),
            finalize(() => this.isLoadingSubject.next(false)),
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
        this.isLoadingSubject.next(true);
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
            finalize(() => this.isLoadingSubject.next(false)),
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
                id: `order-${order.id}-${item.name}`, // Use consistent ID based on order and item
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            });
        });

        this.notificationService.success('Commande ajoutée au panier');
        return of(true);
    }

    /**
     * Supprime une commande par son ID
     */
    deleteOrder(orderId: string): Observable<void> {
        this.isLoadingSubject.next(true);
        return this.apiService.delete<void>(`orders/${orderId}`).pipe(
            tap(() => {
                this.currentOrderSubject.next(null);
                this.notificationService.success('Commande supprimée avec succès');
            }),
            finalize(() => this.isLoadingSubject.next(false)),
            catchError(error => {
                this.notificationService.error('Erreur lors de la suppression de la commande');
                return throwError(() => error);
            })
        );
    }

    setOrderTotal(total: number) {
        this.orderTotal.next(total);
    }

    getOrderTotal(): number {
        return this.orderTotal.value;
    }

    /**
     * Creates a mock order from the current cart
     */
    createMockOrder(): Observable<Order> {
        // Get cart items synchronously
        let cartItems: CartItem[] = [];
        this.cartService.getCartItems().subscribe(items => {
            cartItems = items;
        });

        const subtotal = this.cartService.getTotal();
        const fees = {
            amount: subtotal * 0.1, // 10% fee
            percentage: 10
        };
        const total = subtotal + fees.amount;

        const mockOrder: Order = {
            id: Date.now().toString(),
            date: new Date(),
            items: cartItems.map((item: CartItem) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || ''
            })),
            subtotal,
            fees,
            total,
            status: [
                {
                    status: 'En préparation',
                    timestamp: new Date().toISOString()
                }
            ]
        };

        this.mockOrders.push(mockOrder);
        this.currentOrderSubject.next(mockOrder);
        this.notificationService.success('Commande créée avec succès');
        this.cartService.clearCart();
        
        return of(mockOrder);
    }

    /**
     * Gets all mock orders
     */
    getMockOrders(): Observable<Order[]> {
        return of(this.mockOrders);
    }
} 