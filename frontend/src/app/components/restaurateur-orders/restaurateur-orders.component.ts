import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { MockRestaurateurOrdersService } from '../../services/mock-restaurateur-orders.service';
import { RestaurateurOrder } from '../../models/restaurateur-order.model';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../services/notification.service';

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
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './restaurateur-orders.component.html',
  styleUrls: ['./restaurateur-orders.component.scss']
})
export class RestaurateurOrdersComponent implements OnInit, OnDestroy {
  currentOrders: RestaurateurOrder[] = [];
  orderHistory: RestaurateurOrder[] = [];
  selectedOrder: RestaurateurOrder | null = null;
  displayedColumns: string[] = ['id', 'date', 'articles', 'status', 'actions'];
  historyDisplayedColumns: string[] = ['id', 'date', 'articles', 'amount', 'action'];
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private restaurateurOrdersService: MockRestaurateurOrdersService,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // S'abonner à l'état de chargement
    this.subscriptions.push(
      this.restaurateurOrdersService.isLoading$.subscribe(loading => {
        this.isLoading = loading;
      })
    );
    
    this.loadCurrentOrders();
    this.loadOrderHistory();
  }

  ngOnDestroy(): void {
    // Nettoyer toutes les souscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCurrentOrders(): void {
    this.restaurateurOrdersService.getCurrentOrders().subscribe({
      next: (orders) => {
        this.currentOrders = orders;
      },
      error: (error) => {
        console.error('Error loading current orders:', error);
        this.notificationService.error('Impossible de charger les commandes actuelles');
      }
    });
  }

  loadOrderHistory(): void {
    this.restaurateurOrdersService.getOrderHistory().subscribe({
      next: (history) => {
        this.orderHistory = history;
      },
      error: (error) => {
        console.error('Error loading order history:', error);
        this.notificationService.error('Impossible de charger l\'historique des commandes');
      }
    });
  }

  validateOrder(order: RestaurateurOrder): void {
    this.restaurateurOrdersService.validateOrder(order.id).subscribe({
      next: (success) => {
        if (success) {
          this.loadCurrentOrders();
          if (this.selectedOrder && this.selectedOrder.id === order.id) {
            // Refresh selected order details if currently selected
            this.showOrderDetails(order);
          }
        }
      },
      error: (error) => {
        console.error('Error validating order:', error);
        this.notificationService.error('Impossible de valider la commande');
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
              this.notificationService.success('Commande annulée avec succès');
              // Refresh both lists to ensure UI is in sync
              this.loadCurrentOrders();
              this.loadOrderHistory();
              this.selectedOrder = null;
            }
          },
          error: (error) => {
            console.error('Error cancelling order:', error);
            this.notificationService.error('Impossible d\'annuler la commande');
          }
        });
      }
    });
  }
  
  markAsReady(): void {
    if (this.selectedOrder) {
      this.restaurateurOrdersService.markAsReady(this.selectedOrder.id).subscribe({
        next: (success) => {
          if (success) {
            this.loadCurrentOrders();
            // Refresh selected order details
            const updatedOrder = this.currentOrders.find(order => order.id === this.selectedOrder?.id);
            if (updatedOrder) {
              this.showOrderDetails(updatedOrder);
            }
          }
        },
        error: (error) => {
          console.error('Error marking order as ready:', error);
          this.notificationService.error('Impossible de marquer la commande comme prête');
        }
      });
    }
  }
} 