import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Restaurant, Menu, MenuItem } from '../../../models/restaurant.model';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { RestaurantService } from '../../../services/restaurant.service';
import { RestaurateurMenuUpdateComponent } from '../restaurateur-menu-update/restaurateur-menu-update.component';
import { RestaurateurItemUpdateComponent } from '../restaurateur-item-update/restaurateur-item-update.component';
import { NotificationService } from '../../../services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-restaurateur-menu-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './restaurateur-menu-management.component.html',
  styleUrls: ['./restaurateur-menu-management.component.scss']
})
export class RestaurateurMenuManagementComponent implements OnInit {
  restaurant: Restaurant = {
    id: '',
    name: '',
    menus: [],
    articles: []
  };
  isLoading = true;
  error = '';
  
  // Pagination
  pageSize = 6; // Nombre d'éléments par page
  currentMenuPage = 1;
  currentArticlePage = 1;
  paginatedMenus: Menu[] = [];
  paginatedArticles: MenuItem[] = [];
  Math = Math; // Pour utiliser Math dans le template

  constructor(
    private dialog: MatDialog,
    private restaurantService: RestaurantService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRestaurantDetails();
  }

  loadRestaurantDetails(): void {
    this.isLoading = true;
    this.error = '';
    
    this.restaurantService.getMyRestaurant()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (restaurant: Restaurant) => {
          this.restaurant = restaurant;
          // S'assurer que les tableaux existent
          if (!this.restaurant.menus) this.restaurant.menus = [];
          if (!this.restaurant.articles) this.restaurant.articles = [];
          
          // Initialiser la pagination
          this.updatePaginatedMenus();
          this.updatePaginatedArticles();
        },
        error: (error) => {
          this.error = 'Impossible de charger les informations du restaurant. Veuillez réessayer plus tard.';
          this.notificationService.error('Erreur lors de la récupération des informations du restaurant');
          console.error('Erreur lors du chargement du restaurant:', error);
        }
      });
  }
  
  // Méthodes de pagination
  updatePaginatedMenus(): void {
    const start = (this.currentMenuPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedMenus = this.restaurant.menus ? this.restaurant.menus.slice(start, end) : [];
  }
  
  updatePaginatedArticles(): void {
    const start = (this.currentArticlePage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedArticles = this.restaurant.articles ? this.restaurant.articles.slice(start, end) : [];
  }
  
  nextMenuPage(): void {
    const totalMenus = this.restaurant.menus ? this.restaurant.menus.length : 0;
    if (this.currentMenuPage * this.pageSize < totalMenus) {
      this.currentMenuPage++;
      this.updatePaginatedMenus();
    }
  }
  
  prevMenuPage(): void {
    if (this.currentMenuPage > 1) {
      this.currentMenuPage--;
      this.updatePaginatedMenus();
    }
  }
  
  nextArticlePage(): void {
    const totalArticles = this.restaurant.articles ? this.restaurant.articles.length : 0;
    if (this.currentArticlePage * this.pageSize < totalArticles) {
      this.currentArticlePage++;
      this.updatePaginatedArticles();
    }
  }
  
  prevArticlePage(): void {
    if (this.currentArticlePage > 1) {
      this.currentArticlePage--;
      this.updatePaginatedArticles();
    }
  }

  openMenuDialog(menu?: Menu): void {
    const dialogRef = this.dialog.open(RestaurateurMenuUpdateComponent, {
      width: '600px',
      data: { menu, restaurantId: this.restaurant.id }
    });

    dialogRef.afterClosed().subscribe((result: Menu) => {
      if (result) {
        if (menu) {
          this.isLoading = true;
          this.restaurantService.updateMenu(this.restaurant.id, result)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
              next: () => {
                this.loadRestaurantDetails();
                this.notificationService.success('Menu mis à jour avec succès');
              },
              error: (error) => {
                this.notificationService.error('Erreur lors de la mise à jour du menu');
                console.error('Erreur lors de la mise à jour du menu:', error);
              }
            });
        } else {
          this.isLoading = true;
          this.restaurantService.createMenu(this.restaurant.id, result)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
              next: () => {
                this.loadRestaurantDetails();
                this.notificationService.success('Menu créé avec succès');
              },
              error: (error) => {
                this.notificationService.error('Erreur lors de la création du menu');
                console.error('Erreur lors de la création du menu:', error);
              }
            });
        }
      }
    });
  }

  openItemDialog(item?: MenuItem): void {
    const dialogRef = this.dialog.open(RestaurateurItemUpdateComponent, {
      width: '600px',
      data: { item, restaurantId: this.restaurant.id }
    });

    dialogRef.afterClosed().subscribe((result: MenuItem) => {
      if (result) {
        if (item) {
          this.isLoading = true;
          this.restaurantService.updateArticle(this.restaurant.id, result)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
              next: () => {
                this.loadRestaurantDetails();
                this.notificationService.success('Article mis à jour avec succès');
              },
              error: (error) => {
                this.notificationService.error('Erreur lors de la mise à jour de l\'article');
                console.error('Erreur lors de la mise à jour de l\'article:', error);
              }
            });
        } else {
          this.isLoading = true;
          this.restaurantService.createArticle(this.restaurant.id, result)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
              next: () => {
                this.loadRestaurantDetails();
                this.notificationService.success('Article créé avec succès');
              },
              error: (error) => {
                this.notificationService.error('Erreur lors de la création de l\'article');
                console.error('Erreur lors de la création de l\'article:', error);
              }
            });
        }
      }
    });
  }

  deleteMenu(menu: Menu): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer le menu',
        message: `Êtes-vous sûr de vouloir supprimer le menu "${menu.name}" ?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.isLoading = true;
        this.restaurantService.deleteMenu(this.restaurant.id, menu.id)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: () => {
              this.loadRestaurantDetails();
              this.notificationService.success('Menu supprimé avec succès');
            },
            error: (error) => {
              this.notificationService.error('Erreur lors de la suppression du menu');
              console.error('Erreur lors de la suppression du menu:', error);
            }
          });
      }
    });
  }

  deleteArticle(item: MenuItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer l\'article',
        message: `Êtes-vous sûr de vouloir supprimer l'article "${item.name}" ?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.isLoading = true;
        this.restaurantService.deleteArticle(this.restaurant.id, item.id)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: () => {
              this.loadRestaurantDetails();
              this.notificationService.success('Article supprimé avec succès');
            },
            error: (error) => {
              this.notificationService.error('Erreur lors de la suppression de l\'article');
              console.error('Erreur lors de la suppression de l\'article:', error);
            }
          });
      }
    });
  }
} 