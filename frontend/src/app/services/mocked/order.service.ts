import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, OrderHistory } from '../../models/order.model';
import { CartService } from './cart.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private currentOrder: Order | null = {
        id: '9845',
        date: new Date('2025-03-21T05:24:32'),
        items: [
            { quantity: 1, name: 'Cola', price: 2.00, image: 'assets/images/cola.jpg' },
            { quantity: 2, name: 'Kebab', price: 7.50, image: 'assets/images/kebab.jpg' }
        ],
        subtotal: 17.00,
        fees: {
            amount: 6.00,
            percentage: 30
        },
        total: 23.00,
        status: [
            { timestamp: '06:23:21', status: 'Commande acceptée' },
            { timestamp: '06:25:32', status: 'Commande en cours de préparation' }
        ]
    };

    private orderHistory: OrderHistory[] = [
        { id: 1, dateTime: new Date('2025-03-21T08:57:21'), amount: 25.98, paymentType: 'Carte Bancaire' },
        { id: 2, dateTime: new Date('2025-03-21T08:57:21'), amount: 13.45, paymentType: 'PayPal' },
        { id: 3, dateTime: new Date('2025-03-21T08:57:21'), amount: 32.99, paymentType: 'Apple Pay' }
    ];

    constructor(private cartService: CartService) {}

    getCurrentOrder(): Observable<Order | null> {
        return of(this.currentOrder);
    }

    getOrderHistory(): Observable<OrderHistory[]> {
        return of(this.orderHistory);
    }

    updateOrder(order: Order): Observable<Order> {
        this.currentOrder = order;
        return of(order);
    }

    deleteOrder(orderId: string): Observable<boolean> {
        if (this.currentOrder?.id === orderId) {
            this.currentOrder = null;
            return of(true);
        }
        return of(false);
    }

    moveOrderToCart(order: Order): Observable<boolean> {
        if (!order) return of(false);
        
        // Clear existing cart items
        this.cartService.clearCart();
        
        // Add order items to cart
        order.items.forEach(item => {
            this.cartService.addToCart({
                id: Date.now().toString(),
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            });
        });

        // Delete the order
        return this.deleteOrder(order.id);
    }
} 