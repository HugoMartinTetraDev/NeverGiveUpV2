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
      revenue: 12349.59,
      orderCount: 835,
      averageTicket: 0
    },
    revenueAnalysis: []
  };

  constructor() {}

  ngOnInit(): void {
    // Initialize with mock data
    this.loadOrders();
  }

  loadOrders(): void {
    // Mock data matching the mockup
    this.orders = [
      {
        id: '1',
        date: new Date('2025-03-19T15:05:13'),
        items: [{ quantity: 1, name: 'Classic Burger Menu', price: 15.99, image: '' }],
        subtotal: 15.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 18.98,
        status: [{ timestamp: new Date().toISOString(), status: 'Livraison en cours' }]
      },
      {
        id: '2',
        date: new Date('2025-03-19T15:05:13'),
        items: [{ quantity: 1, name: 'Frites', price: 3.99, image: '' }],
        subtotal: 3.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 6.98,
        status: [{ timestamp: new Date().toISOString(), status: 'Livraison en cours' }]
      },
      {
        id: '3',
        date: new Date('2025-03-19T15:05:13'),
        items: [{ quantity: 1, name: 'Classic Burger', price: 12.99, image: '' }],
        subtotal: 12.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 15.98,
        status: [{ timestamp: new Date().toISOString(), status: 'En attente de réception' }]
      },
      {
        id: '4',
        date: new Date('2025-03-19T15:05:13'),
        items: [{ quantity: 1, name: 'Classic Burger Menu', price: 15.99, image: '' }],
        subtotal: 15.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 18.98,
        status: [{ timestamp: new Date().toISOString(), status: 'En attente de réception' }]
      },
      {
        id: '5',
        date: new Date('2025-03-19T15:05:13'),
        items: [{ quantity: 1, name: 'Frites', price: 3.99, image: '' }],
        subtotal: 3.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 6.98,
        status: [{ timestamp: new Date().toISOString(), status: 'Préparation en cours' }]
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