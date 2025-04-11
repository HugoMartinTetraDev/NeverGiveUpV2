import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { DeleteOrderDialogComponent } from './delete-order-dialog/delete-order-dialog.component';
import { ModifyOrderDialogComponent } from './modify-order-dialog/modify-order-dialog.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatListModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
    @Input() order: Order | null = null;
    isLoading = false;
    private subscriptions: Subscription[] = [];

    constructor(
        private orderService: OrderService,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // Souscrire à l'état de chargement
        this.subscriptions.push(
            this.orderService.isLoading$.subscribe(loading => {
                this.isLoading = loading;
            })
        );

        // Si aucun ordre n'est fourni en input, essayer de récupérer depuis le service
        if (!this.order) {
            this.subscriptions.push(
                this.orderService.currentOrder$.subscribe(order => {
                    this.order = order;
                })
            );
        }

        // Récupérer l'ID de la commande depuis l'URL si présent
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.orderService.getOrderById(params['id']).subscribe();
            }
        });
    }

    ngOnDestroy() {
        // Nettoyer les souscriptions pour éviter les fuites de mémoire
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onModify() {
        if (!this.order) return;
        
        const dialogRef = this.dialog.open(ModifyOrderDialogComponent, {
            width: '480px',
            disableClose: true,
            panelClass: 'order-dialog',
            data: { order: this.order }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.orderService.moveOrderToCart(this.order!).subscribe();
            }
        });
    }

    onDelete() {
        const dialogRef = this.dialog.open(DeleteOrderDialogComponent, {
            width: '480px',
            disableClose: true,
            panelClass: 'order-dialog'
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result && this.order) {
                this.orderService.deleteOrder(this.order.id).subscribe();
            }
        });
    }
} 