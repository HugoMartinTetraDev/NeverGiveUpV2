import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../models/restaurant.model';

@Component({
  selector: 'app-menu-item-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './menu-item-detail.component.html',
  styleUrls: ['./menu-item-detail.component.scss']
})
export class MenuItemDetailComponent {
  selectedOptions: { [key: string]: string | string[] } = {};
  quantity = 1;

  constructor(
    public dialogRef: MatDialogRef<MenuItemDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: MenuItem }
  ) {
    // Initialize default selections
    if (data.item.options) {
      data.item.options.forEach(option => {
        if (option.multiSelect) {
          this.selectedOptions[option.name] = [];
        } else {
          this.selectedOptions[option.name] = option.defaultChoice || option.choices[0];
        }
      });
    }
  }

  isOptionSelected(optionName: string, choice: string): boolean {
    return (this.selectedOptions[optionName] as string[]).includes(choice);
  }

  toggleOption(optionName: string, choice: string, checked: boolean): void {
    const options = this.selectedOptions[optionName] as string[];
    if (checked) {
      options.push(choice);
    } else {
      const index = options.indexOf(choice);
      if (index > -1) {
        options.splice(index, 1);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addToCart(): void {
    this.dialogRef.close({
      item: this.data.item,
      quantity: this.quantity,
      selectedOptions: this.selectedOptions
    });
  }

  updateQuantity(change: number): void {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1) {
      this.quantity = newQuantity;
    }
  }
} 