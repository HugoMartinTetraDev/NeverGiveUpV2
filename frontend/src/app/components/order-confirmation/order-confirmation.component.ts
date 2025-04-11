import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  orderDate = new Date();
  total: number = 0;

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.total = this.orderService.getOrderTotal();
  }

  goToOrders() {
    this.orderService.createMockOrder().subscribe(() => {
      this.router.navigate(['/commandes']);
    });
  }
} 