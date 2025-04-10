import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart-delete-dialog',
  templateUrl: './cart-delete-dialog.component.html',
  styleUrls: ['./cart-delete-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class CartDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CartDeleteDialogComponent>
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 