import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurateurOrdersService } from '../../../services/mocked/restaurateur-orders.service';
import { RestaurateurOrder } from '../../../models/restaurateur-order.model';

@Component({
  selector: 'app-restaurateur-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class RestaurateurOrderDetailsComponent implements OnInit {
  order: RestaurateurOrder | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurateurOrdersService: RestaurateurOrdersService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadOrder(id);
      }
    });
  }
  
  loadOrder(id: number): void {
    this.restaurateurOrdersService.getCurrentOrders().subscribe(orders => {
      this.order = orders.find(o => o.id === id) || null;
      
      if (!this.order) {
        this.restaurateurOrdersService.getOrderHistory().subscribe(history => {
          this.order = history.find(o => o.id === id) || null;
        });
      }
    });
  }
  
  validateOrder(): void {
    if (this.order) {
      this.restaurateurOrdersService.validateOrder(this.order.id).subscribe(() => {
        this.loadOrder(this.order!.id);
      });
    }
  }
  
  cancelOrder(): void {
    console.log('Order cancelled');
    // Implementation would go here
  }
  
  markAsReady(): void {
    console.log('Order marked as ready');
    // Implementation would go here
  }
  
  goBack(): void {
    this.router.navigate(['/restaurateur/commandes']);
  }
} 