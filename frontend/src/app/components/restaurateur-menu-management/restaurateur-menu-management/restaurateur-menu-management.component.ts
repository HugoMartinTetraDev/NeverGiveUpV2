import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Restaurant, Menu, MenuItem } from '../../../models/restaurant.model';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { RestaurantService } from '../../../services/restaurant.service';
import { RestaurateurMenuUpdateComponent } from '../restaurateur-menu-update/restaurateur-menu-update.component';
import { RestaurateurItemUpdateComponent } from '../restaurateur-item-update/restaurateur-item-update.component';

@Component({
  selector: 'app-restaurateur-menu-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './restaurateur-menu-management.component.html',
  styleUrls: ['./restaurateur-menu-management.component.scss']
})
export class RestaurateurMenuManagementComponent implements OnInit {
  restaurant!: Restaurant;
  restaurantId = '1'; // ID du restaurant du restaurateur connecté

  constructor(
    private dialog: MatDialog,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du restaurant du restaurateur connecté (à implémenter avec AuthService)
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe((restaurant: Restaurant) => {
      this.restaurant = restaurant;
    });
  }

  openMenuDialog(menu?: Menu): void {
    const dialogRef = this.dialog.open(RestaurateurMenuUpdateComponent, {
      width: '600px',
      data: { menu }
    });

    dialogRef.afterClosed().subscribe((result: Menu) => {
      if (result) {
        if (menu) {
          this.restaurantService.updateMenu(this.restaurantId, result).subscribe();
        } else {
          this.restaurantService.createMenu(this.restaurantId, result).subscribe();
        }
      }
    });
  }

  openItemDialog(item?: MenuItem): void {
    const dialogRef = this.dialog.open(RestaurateurItemUpdateComponent, {
      width: '600px',
      data: { item }
    });

    dialogRef.afterClosed().subscribe((result: MenuItem) => {
      if (result) {
        if (item) {
          this.restaurantService.updateArticle(this.restaurantId, result).subscribe();
        } else {
          this.restaurantService.createArticle(this.restaurantId, result).subscribe();
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
        this.restaurantService.deleteMenu(this.restaurantId, menu.id).subscribe();
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
        this.restaurantService.deleteArticle(this.restaurantId, item.id).subscribe();
      }
    });
  }
} 