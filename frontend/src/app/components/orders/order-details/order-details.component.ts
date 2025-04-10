import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { DeleteOrderDialogComponent } from './delete-order-dialog/delete-order-dialog.component';
import { ModifyOrderDialogComponent } from './modify-order-dialog/modify-order-dialog.component';

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatListModule,
        MatDialogModule
    ],
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
    currentOrder: Order | null = null;

    constructor(
        private orderService: OrderService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.loadOrder();
    }

    loadOrder() {
        this.orderService.getCurrentOrder().subscribe(order => {
            this.currentOrder = order;
        });
    }

    onModify() {
        const dialogRef = this.dialog.open(ModifyOrderDialogComponent, {
            width: '480px',
            disableClose: true,
            panelClass: 'order-dialog',
            data: { order: this.currentOrder }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.currentOrder = null;
            }
        });
    }

    onDelete() {
        const dialogRef = this.dialog.open(DeleteOrderDialogComponent, {
            width: '480px',
            disableClose: true,
            panelClass: 'order-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && this.currentOrder) {
                this.orderService.deleteOrder(this.currentOrder.id).subscribe(success => {
                    if (success) {
                        this.currentOrder = null;
                    }
                });
            }
        });
    }
} 