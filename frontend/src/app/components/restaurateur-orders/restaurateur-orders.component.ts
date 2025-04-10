import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { RestaurateurOrdersService } from '../../services/mocked/restaurateur-orders.service';
import { RestaurateurOrder } from '../../models/restaurateur-order.model';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-restaurateur-orders',
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
  templateUrl: './restaurateur-orders.component.html',
  styleUrls: ['./restaurateur-orders.component.scss']
})
export class RestaurateurOrdersComponent implements OnInit {
  currentOrders: RestaurateurOrder[] = [];
  orderHistory: RestaurateurOrder[] = [];
  selectedOrder: RestaurateurOrder | null = null;
  displayedColumns: string[] = ['id', 'date', 'articles', 'status', 'actions'];
  historyDisplayedColumns: string[] = ['id', 'date', 'articles', 'amount', 'action'];

  constructor(
    private restaurateurOrdersService: RestaurateurOrdersService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCurrentOrders();
    this.loadOrderHistory();
  }

  loadCurrentOrders(): void {
    this.restaurateurOrdersService.getCurrentOrders().subscribe(orders => {
      this.currentOrders = orders;
    });
  }

  loadOrderHistory(): void {
    this.restaurateurOrdersService.getOrderHistory().subscribe(history => {
      this.orderHistory = history;
    });
  }

  validateOrder(order: RestaurateurOrder): void {
    this.restaurateurOrdersService.validateOrder(order.id).subscribe(() => {
      this.loadCurrentOrders();
      if (this.selectedOrder && this.selectedOrder.id === order.id) {
        // Refresh selected order details if currently selected
        this.showOrderDetails(order);
      }
    });
  }

  showOrderDetails(order: RestaurateurOrder): void {
    this.selectedOrder = order;
  }

  hideOrderDetails(): void {
    this.selectedOrder = null;
  }

  cancelOrder(): void {
    if (!this.selectedOrder) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression de la commande',
        message: 'Êtes-vous sûr de vouloir supprimer la commande ?',
        confirmText: 'SUPPRIMER',
        cancelText: 'ANNULER'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedOrder) {
        this.restaurateurOrdersService.cancelOrder(this.selectedOrder.id).subscribe({
          next: (success) => {
            if (success) {
              // Refresh both lists to ensure UI is in sync
              this.loadCurrentOrders();
              this.loadOrderHistory();
              this.selectedOrder = null;
            }
          },
          error: (error) => {
            console.error('Error cancelling order:', error);
            // You might want to show an error message to the user here
            const errorDialog = this.dialog.open(ConfirmDialogComponent, {
              data: {
                title: 'Erreur',
                message: 'Une erreur est survenue lors de l\'annulation de la commande.',
                confirmText: 'OK'
              }
            });
          }
        });
      }
    });
  }
  
  markAsReady(): void {
    if (this.selectedOrder) {
      this.restaurateurOrdersService.markAsReady(this.selectedOrder.id).subscribe(() => {
        this.loadCurrentOrders();
        // Refresh selected order details
        const updatedOrder = this.currentOrders.find(order => order.id === this.selectedOrder?.id);
        if (updatedOrder) {
          this.showOrderDetails(updatedOrder);
        }
      });
    }
  }
} 