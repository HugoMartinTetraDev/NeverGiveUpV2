import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Menu, MenuItem } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurateur-menu-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './restaurateur-menu-update.component.html',
  styleUrls: ['./restaurateur-menu-update.component.scss']
})
export class RestaurateurMenuUpdateComponent implements OnInit {
  menu: Partial<Menu> = {};
  availableItems: (MenuItem & { selected?: boolean })[] = [];

  constructor(
    private dialogRef: MatDialogRef<RestaurateurMenuUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { menu?: Menu }
  ) {}

  ngOnInit(): void {
    if (this.data.menu) {
      this.menu = { ...this.data.menu };
    }
    // Mock data for available items
    this.availableItems = [
      { id: '1', name: 'Classic Burger', price: 8.00, selected: true },
      { id: '2', name: 'Frites', price: 3.00, selected: true },
      { id: '3', name: 'Coca', price: 2.50, selected: true },
      { id: '4', name: 'Glace', price: 3.50, selected: false }
    ];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.menu.image = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.menu.image = undefined;
  }

  onSave(): void {
    const selectedItems = this.availableItems
      .filter(item => item.selected)
      .map(({ selected, ...item }) => item);
    
    const menuData = {
      ...this.menu,
      items: selectedItems
    };
    
    this.dialogRef.close(menuData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 