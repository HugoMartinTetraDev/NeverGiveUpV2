import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Menu, MenuItem } from '../../../models/restaurant.model';
import { NotificationService } from '../../../services/notification.service';
import { MockDataService } from '../../../services/mock-data.service';

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
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './restaurateur-menu-update.component.html',
  styleUrls: ['./restaurateur-menu-update.component.scss']
})
export class RestaurateurMenuUpdateComponent implements OnInit {
  @ViewChild('menuForm') menuForm!: NgForm;
  
  menu: Partial<Menu> = {
    name: '',
    price: 0,
    description: '',
    items: []
  };
  availableItems: (MenuItem & { selected?: boolean })[] = [];
  filteredItems: (MenuItem & { selected?: boolean })[] = [];
  restaurantId = '';
  searchQuery = '';
  maxImageSize = 1024 * 1024; // 1MB
  imageError = '';
  uploadFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<RestaurateurMenuUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { menu?: Menu, restaurantId: string },
    private notificationService: NotificationService,
    private mockDataService: MockDataService
  ) {
    this.restaurantId = data.restaurantId;
  }

  ngOnInit(): void {
    if (this.data.menu) {
      this.menu = { ...this.data.menu };
    }
    this.loadArticles();
  }

  loadArticles(): void {
    const selectedIds = this.data.menu?.items?.map(item => item.id) || [];
    this.availableItems = this.mockDataService.getMockItemsWithSelection(selectedIds);
    this.filteredItems = [...this.availableItems];
  }

  filterItems(): void {
    if (!this.searchQuery.trim()) {
      this.filteredItems = [...this.availableItems];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredItems = this.availableItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      (item.description && item.description.toLowerCase().includes(query))
    );
  }

  getSelectedCount(): number {
    return this.availableItems.filter(item => item.selected).length;
  }

  hasSelectedItems(): boolean {
    return this.getSelectedCount() > 0;
  }

  onFileSelected(event: Event): void {
    this.imageError = '';
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (file.size > this.maxImageSize) {
        this.imageError = `L'image est trop volumineuse (max: ${this.maxImageSize / 1024 / 1024}MB)`;
        return;
      }
      
      if (!file.type.match('image/*')) {
        this.imageError = 'Seuls les formats d\'image sont acceptés';
        return;
      }
      
      this.uploadFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.menu.image = e.target?.result as string;
      };
      
      reader.onerror = () => {
        this.imageError = 'Erreur lors de la lecture du fichier';
      };
      
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.menu.image = undefined;
    this.imageError = '';
    this.uploadFile = null;
  }

  validateForm(): boolean {
    if (!this.menuForm.valid) {
      this.notificationService.error('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    
    if (this.menu.price === undefined || this.menu.price <= 0) {
      this.notificationService.error('Le prix doit être supérieur à zéro');
      return false;
    }
    
    if (this.getSelectedCount() === 0) {
      this.notificationService.error('Veuillez sélectionner au moins un article');
      return false;
    }
    
    return true;
  }

  calculateSuggestedPrice(): void {
    const selectedItems = this.availableItems.filter(item => item.selected);
    if (selectedItems.length > 0) {
      const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
      this.menu.price = Math.round((totalPrice * 0.9) * 100) / 100;
    }
  }

  onSave(): void {
    if (!this.validateForm()) {
      return;
    }
    
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