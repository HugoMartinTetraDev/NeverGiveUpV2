import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Order } from '../../models/order.model';
import { Statistics } from '../../models/statistics.model';

@Component({
  selector: 'app-commercial-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule
  ],
  templateUrl: './commercial-orders.component.html',
  styleUrls: ['./commercial-orders.component.scss']
})
export class CommercialOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  displayedColumns: string[] = ['id', 'date', 'articles', 'status', 'action'];
  
  statistics: Statistics = {
    currentMonth: {
      revenue: 187.23,
      orderCount: 5,
      averageTicket: 297.62
    },
    revenueAnalysis: []
  };

  constructor() {}

  ngOnInit(): void {
    // Initialize with mock data
    this.loadOrders();
  }

  loadOrders(): void {
    // Mock data with more realistic and varied orders
    this.orders = [
      {
        id: '1',
        date: new Date('2024-04-09T15:05:13'),
        items: [
          { quantity: 2, name: 'Classic Burger Menu', price: 15.99, image: '' },
          { quantity: 1, name: 'Frites', price: 3.99, image: '' },
          { quantity: 2, name: 'Coca-Cola', price: 2.99, image: '' }
        ],
        subtotal: 45.94,
        fees: { amount: 4.59, percentage: 10 },
        total: 50.53,
        status: [{ timestamp: new Date().toISOString(), status: 'Livraison en cours' }]
      },
      {
        id: '2',
        date: new Date('2024-04-09T14:30:00'),
        items: [
          { quantity: 1, name: 'Double Cheese Burger', price: 18.99, image: '' },
          { quantity: 1, name: 'Onion Rings', price: 4.99, image: '' }
        ],
        subtotal: 23.98,
        fees: { amount: 2.40, percentage: 10 },
        total: 26.38,
        status: [{ timestamp: new Date().toISOString(), status: 'En attente de réception' }]
      },
      {
        id: '3',
        date: new Date('2024-04-09T14:15:00'),
        items: [
          { quantity: 1, name: 'Veggie Burger', price: 16.99, image: '' },
          { quantity: 1, name: 'Salade César', price: 8.99, image: '' }
        ],
        subtotal: 25.98,
        fees: { amount: 2.60, percentage: 10 },
        total: 28.58,
        status: [{ timestamp: new Date().toISOString(), status: 'Préparation en cours' }]
      },
      {
        id: '4',
        date: new Date('2024-04-09T13:45:00'),
        items: [
          { quantity: 3, name: 'Classic Burger Menu', price: 15.99, image: '' },
          { quantity: 2, name: 'Frites', price: 3.99, image: '' }
        ],
        subtotal: 55.95,
        fees: { amount: 5.60, percentage: 10 },
        total: 61.55,
        status: [{ timestamp: new Date().toISOString(), status: 'Livraison en cours' }]
      },
      {
        id: '5',
        date: new Date('2024-04-09T13:30:00'),
        items: [
          { quantity: 1, name: 'Chicken Burger', price: 17.99, image: '' },
          { quantity: 1, name: 'Frites', price: 3.99, image: '' },
          { quantity: 1, name: 'Milkshake Vanille', price: 5.99, image: '' }
        ],
        subtotal: 27.97,
        fees: { amount: 2.80, percentage: 10 },
        total: 30.77,
        status: [{ timestamp: new Date().toISOString(), status: 'En attente de réception' }]
      }
    ];
  }

  getOrderItems(order: Order): string {
    return order.items.map(item => `${item.name}`).join(', ');
  }

  getOrderStatus(order: Order): string {
    return order.status[order.status.length - 1].status;
  }

  showOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  hideOrderDetails(): void {
    this.selectedOrder = null;
  }
} 