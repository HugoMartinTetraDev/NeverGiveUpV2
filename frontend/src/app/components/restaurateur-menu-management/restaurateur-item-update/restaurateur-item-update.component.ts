import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MenuItem } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurateur-item-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './restaurateur-item-update.component.html',
  styleUrls: ['./restaurateur-item-update.component.scss']
})
export class RestaurateurItemUpdateComponent implements OnInit {
  item: Partial<MenuItem> = {};

  constructor(
    private dialogRef: MatDialogRef<RestaurateurItemUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: MenuItem }
  ) {}

  ngOnInit(): void {
    if (this.data.item) {
      this.item = { ...this.data.item };
    }
  }

  onSave(): void {
    this.dialogRef.close(this.item);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.item.image = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.item.image = undefined;
  }
} 