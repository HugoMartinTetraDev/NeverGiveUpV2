import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuItem } from '../../../models/restaurant.model';
import { RestaurantService } from '../../../services/restaurant.service';
import { NotificationService } from '../../../services/notification.service';
import { UploadService, UploadProgress } from '../../../services/upload.service';

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
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './restaurateur-item-update.component.html',
  styleUrls: ['./restaurateur-item-update.component.scss']
})
export class RestaurateurItemUpdateComponent implements OnInit {
  @ViewChild('itemForm') itemForm!: NgForm;
  
  item: Partial<MenuItem> = {
    name: '',
    price: 0,
    description: ''
  };
  isLoading = false;
  isImageLoading = false;
  maxImageSize = 1024 * 1024; // 1MB
  imageError = '';
  uploadProgress: UploadProgress | null = null;
  uploadFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<RestaurateurItemUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: MenuItem, restaurantId: string },
    private restaurantService: RestaurantService,
    private notificationService: NotificationService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    if (this.data.item) {
      this.item = { ...this.data.item };
    }
  }

  onSave(): void {
    if (!this.validateForm()) {
      return;
    }

    // Si un fichier a été sélectionné mais pas encore uploadé
    if (this.uploadFile && (!this.uploadProgress || this.uploadProgress.state !== 'DONE')) {
      this.uploadImageToServer();
    } else {
      this.dialogRef.close(this.item);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  validateForm(): boolean {
    if (!this.itemForm.valid) {
      this.notificationService.error('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    
    if (this.item.price === undefined || this.item.price <= 0) {
      this.notificationService.error('Le prix doit être supérieur à zéro');
      return false;
    }
    
    return true;
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
        this.item.image = e.target?.result as string;
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
      this.dialogRef.close(this.item);
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
        this.uploadService.uploadImage(compressedFile, 'articles')
          .subscribe({
            next: (progress) => {
              this.uploadProgress = progress;
              
              if (progress.state === 'DONE' && progress.url) {
                // Remplacer l'image base64 par l'URL de l'image uploadée
                this.item.image = progress.url;
                this.isImageLoading = false;
                this.dialogRef.close(this.item);
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
    this.item.image = undefined;
    this.imageError = '';
    this.uploadProgress = null;
    this.uploadFile = null;
  }
} 