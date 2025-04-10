import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    selectedOptions?: { [key: string]: string | string[] };
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = new BehaviorSubject<CartItem[]>([]);

    getCartItems(): Observable<CartItem[]> {
        return this.cartItems.asObservable();
    }

    addToCart(item: CartItem): void {
        const currentItems = this.cartItems.value;
        const existingItem = currentItems.find(i => 
            i.id === item.id && 
            this.areOptionsEqual(i.selectedOptions, item.selectedOptions)
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            currentItems.push(item);
        }

        this.cartItems.next([...currentItems]);
    }

    private areOptionsEqual(options1?: { [key: string]: string | string[] }, 
                          options2?: { [key: string]: string | string[] }): boolean {
        if (!options1 && !options2) return true;
        if (!options1 || !options2) return false;

        const keys1 = Object.keys(options1);
        const keys2 = Object.keys(options2);

        if (keys1.length !== keys2.length) return false;

        return keys1.every(key => {
            const val1 = options1[key];
            const val2 = options2[key];

            if (Array.isArray(val1) && Array.isArray(val2)) {
                return val1.length === val2.length && 
                       val1.every(v => val2.includes(v));
            }

            return val1 === val2;
        });
    }

    clearCart(): void {
        this.cartItems.next([]);
    }

    getTotal(): number {
        return this.cartItems.value.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0);
    }

    updateQuantity(item: CartItem, newQuantity: number): void {
        const currentItems = this.cartItems.value;
        const existingItem = currentItems.find(i => 
            i.id === item.id && 
            this.areOptionsEqual(i.selectedOptions, item.selectedOptions)
        );
        
        if (existingItem) {
            existingItem.quantity = newQuantity;
            this.cartItems.next([...currentItems]);
        }
    }

    removeFromCart(item: CartItem): void {
        const currentItems = this.cartItems.value;
        const updatedItems = currentItems.filter(i => 
            !(i.id === item.id && 
              this.areOptionsEqual(i.selectedOptions, item.selectedOptions))
        );
        this.cartItems.next(updatedItems);
    }
} 