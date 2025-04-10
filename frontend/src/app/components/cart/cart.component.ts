import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { CartDeleteDialogComponent } from './cart-delete-dialog/cart-delete-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.addToCart({ ...item, quantity: 1 });
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item, item.quantity - 1);
    } else {
      this.cartService.removeFromCart(item);
    }
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(CartDeleteDialogComponent, {
      width: '400px',
      panelClass: 'rounded-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearCart();
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
} 