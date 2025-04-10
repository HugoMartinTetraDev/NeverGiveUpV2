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
import { RestaurantService } from '../../../services/restaurant.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../../../services/notification.service';
import { UploadService, UploadProgress } from '../../../services/upload.service';

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
  isLoading = false;
  isImageLoading = false;
  restaurantId = '';
  searchQuery = '';
  maxImageSize = 1024 * 1024; // 1MB
  imageError = '';
  uploadProgress: UploadProgress | null = null;
  uploadFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<RestaurateurMenuUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { menu?: Menu, restaurantId: string },
    private restaurantService: RestaurantService,
    private notificationService: NotificationService,
    private uploadService: UploadService
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
    this.isLoading = true;
    this.restaurantService.getArticles(this.restaurantId)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.filterItems();
      }))
      .subscribe({
        next: (articles: MenuItem[]) => {
          // Marquer les articles comme sélectionnés s'ils sont déjà dans le menu
          this.availableItems = articles.map(article => ({
            ...article,
            selected: this.data.menu?.items?.some(item => item.id === article.id) || false
          }));
          this.filteredItems = [...this.availableItems];
        },
        error: (error) => {
          console.error('Erreur lors du chargement des articles:', error);
          this.notificationService.error('Échec du chargement des articles');
        }
      });
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
    this.uploadProgress = null;
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Vérifier la taille du fichier
      if (file.size > this.maxImageSize) {
        this.imageError = `L'image est trop volumineuse (max: ${this.maxImageSize / 1024 / 1024}MB)`;
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.match('image/*')) {
        this.imageError = 'Seuls les formats d\'image sont acceptés';
        return;
      }
      
      this.isImageLoading = true;
      this.uploadFile = file;
      
      // Prévisualiser l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.menu.image = e.target?.result as string;
        this.isImageLoading = false;
      };
      
      reader.onerror = () => {
        this.isImageLoading = false;
        this.imageError = 'Erreur lors de la lecture du fichier';
      };
      
      reader.readAsDataURL(file);
    }
  }

  uploadImageToServer(): void {
    if (!this.uploadFile) {
      this.finalizeSave();
      return;
    }
    
    this.isImageLoading = true;
    
    // Comprimer l'image avant upload
    this.uploadService.compressImage(this.uploadFile, 800, 600, 0.7)
      .then(compressedBlob => {
        // Créer un nouveau fichier avec le blob compressé
        const compressedFile = new File([compressedBlob], this.uploadFile!.name, {
          type: this.uploadFile!.type
        });
        
        // Uploader le fichier compressé
        this.uploadService.uploadImage(compressedFile, 'menus')
          .subscribe({
            next: (progress) => {
              this.uploadProgress = progress;
              
              if (progress.state === 'DONE' && progress.url) {
                // Remplacer l'image base64 par l'URL de l'image uploadée
                this.menu.image = progress.url;
                this.isImageLoading = false;
                this.finalizeSave();
              } else if (progress.state === 'ERROR') {
                this.imageError = progress.error || 'Erreur lors de l\'upload';
                this.isImageLoading = false;
              }
            },
            error: (error) => {
              this.imageError = 'Erreur lors de l\'upload de l\'image';
              this.isImageLoading = false;
            }
          });
      })
      .catch(error => {
        this.imageError = 'Erreur lors de la compression de l\'image';
        this.isImageLoading = false;
      });
  }

  removeImage(): void {
    this.menu.image = undefined;
    this.imageError = '';
    this.uploadProgress = null;
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
      // Appliquer une réduction de 10% pour le menu
      this.menu.price = Math.round((totalPrice * 0.9) * 100) / 100;
    }
  }

  finalizeSave(): void {
    const selectedItems = this.availableItems
      .filter(item => item.selected)
      .map(({ selected, ...item }) => item);
    
    const menuData = {
      ...this.menu,
      items: selectedItems
    };
    
    this.dialogRef.close(menuData);
  }

  onSave(): void {
    if (!this.validateForm()) {
      return;
    }
    
    // Si un fichier a été sélectionné mais pas encore uploadé
    if (this.uploadFile && (!this.uploadProgress || this.uploadProgress.state !== 'DONE')) {
      this.uploadImageToServer();
    } else {
      this.finalizeSave();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 