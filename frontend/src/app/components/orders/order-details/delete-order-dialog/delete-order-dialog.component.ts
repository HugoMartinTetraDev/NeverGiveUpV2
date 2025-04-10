import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-delete-order-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule
    ],
    templateUrl: './delete-order-dialog.component.html',
    styleUrls: ['./delete-order-dialog.component.scss']
})
export class DeleteOrderDialogComponent {
    constructor(private dialogRef: MatDialogRef<DeleteOrderDialogComponent>) {}

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
} 