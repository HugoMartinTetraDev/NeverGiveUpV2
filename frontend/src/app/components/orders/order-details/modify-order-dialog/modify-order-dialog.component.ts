import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Order } from '../../../../models/order.model';
import { OrderService } from '../../../../services/order.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-modify-order-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule
    ],
    templateUrl: './modify-order-dialog.component.html',
    styleUrls: ['./modify-order-dialog.component.scss']
})
export class ModifyOrderDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<ModifyOrderDialogComponent>,
        private orderService: OrderService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) private data: { order: Order }
    ) {}

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        if (this.data.order) {
            this.orderService.moveOrderToCart(this.data.order).subscribe(success => {
                if (success) {
                    this.router.navigate(['/customer-purchase']);
                }
                this.dialogRef.close(success);
            });
        } else {
            this.dialogRef.close(false);
        }
    }
} 