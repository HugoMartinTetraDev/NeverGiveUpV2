import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Order } from '../../models/order.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-deliverer-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './deliverer-orders.component.html',
  styleUrls: ['./deliverer-orders.component.scss']
})
export class DelivererOrdersComponent implements OnInit {
  currentDeliveries: Order[] = [];
  proposedDeliveries: Order[] = [];
  selectedOrder: Order | null = null;
  displayedColumns: string[] = ['id', 'date', 'articles', 'status', 'action'];
  proposedColumns: string[] = ['id', 'date', 'articles', 'status', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Mock data would be loaded here
    this.loadCurrentDeliveries();
    this.loadProposedDeliveries();
  }

  loadCurrentDeliveries(): void {
    // Mock data
    this.currentDeliveries = [
      {
        id: '1',
        date: new Date('2025-03-21T08:50:46'),
        items: [{ quantity: 1, name: 'Classic Burger Menu', price: 15.99, image: '' }],
        subtotal: 15.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 18.98,
        status: [{ timestamp: new Date().toISOString(), status: 'Livraison en cours' }]
      },
      {
        id: '2',
        date: new Date('2025-03-21T08:50:46'),
        items: [{ quantity: 1, name: 'Frites', price: 3.99, image: '' }],
        subtotal: 3.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 6.98,
        status: [{ timestamp: new Date().toISOString(), status: 'Livraison en cours' }]
      }
    ];
  }

  loadProposedDeliveries(): void {
    // Mock data
    this.proposedDeliveries = [
      {
        id: '6',
        date: new Date('2025-03-21T08:50:46'),
        items: [{ quantity: 1, name: 'Classic Burger', price: 12.99, image: '' }],
        subtotal: 12.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 15.98,
        status: [{ timestamp: new Date().toISOString(), status: 'En attente' }]
      },
      {
        id: '7',
        date: new Date('2025-03-21T08:50:46'),
        items: [{ quantity: 1, name: 'Classic Burger Menu', price: 15.99, image: '' }],
        subtotal: 15.99,
        fees: { amount: 2.99, percentage: 10 },
        total: 18.98,
        status: [{ timestamp: new Date().toISOString(), status: 'En attente' }]
      }
    ];
  }

  getOrderItems(order: Order): string {
    return order.items.map(item => `${item.quantity}x ${item.name}`).join(', ');
  }

  getOrderStatus(order: Order): string {
    return order.status[order.status.length - 1].status;
  }

  isDeliveryInProgress(order: Order): boolean {
    return this.getOrderStatus(order) === 'Livraison en cours';
  }

  showOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  hideOrderDetails(): void {
    this.selectedOrder = null;
  }

  acceptDelivery(order: Order): void {
    // In a real application, this would make an API call
    order.status.push({ timestamp: new Date().toISOString(), status: 'Livraison en cours' });
    this.currentDeliveries = [...this.currentDeliveries, order];
    this.proposedDeliveries = this.proposedDeliveries.filter(o => o.id !== order.id);
  }

  cancelDelivery(order: Order): void {
    // In a real application, this would make an API call
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Annuler la livraison',
        message: 'Êtes-vous sûr de vouloir annuler cette livraison ?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentDeliveries = this.currentDeliveries.filter(o => o.id !== order.id);
        this.hideOrderDetails();
      }
    });
  }

  markAsDelivered(order: Order): void {
    // In a real application, this would make an API call
    order.status.push({ timestamp: new Date().toISOString(), status: 'Livré' });
    this.currentDeliveries = this.currentDeliveries.filter(o => o.id !== order.id);
    this.hideOrderDetails();
  }
} 