import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';

declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  paymentForm: FormGroup;
  cartItems$: Observable<CartItem[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]],
      cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      cardholderName: ['', Validators.required],
      country: ['FR', Validators.required],
      saveCard: [false]
    });
    this.cartItems$ = this.cartService.getCartItems();
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  ngOnInit() {
    // Initialize Stripe
    const stripe = Stripe('your_publishable_key'); // Replace with your Stripe test key
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      // Here we would normally process the payment with Stripe
      // For demo purposes, we'll just simulate a successful payment
      this.router.navigate(['/order-confirmation']);
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }
} 