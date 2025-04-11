import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Restaurant, Menu, MenuItem } from '../../models/restaurant.model';
import { CartService } from '../../services/cart.service';
import { MenuItemDetailComponent } from '../menu-item-detail/menu-item-detail.component';
import { RestaurantService } from '../../services/restaurant.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatTabsModule,
    MatDialogModule
  ],
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss']
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant | null = null;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private cartService: CartService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const restaurantId = params['id'];
      if (restaurantId) {
        this.loadRestaurantDetails(restaurantId);
      }
    });
  }

  loadRestaurantDetails(restaurantId: string): void {
    this.isLoading = true;
    this.error = '';
    
    this.restaurantService.getRestaurantById(restaurantId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (restaurant: Restaurant) => {
          this.restaurant = restaurant;
        },
        error: (error: Error) => {
          this.error = 'Erreur lors du chargement des détails du restaurant';
          console.error('Error loading restaurant details:', error);
        }
      });
  }

  openMenuDetails(menu: Menu): void {
    // Convert menu to MenuItem format for the dialog
    const menuItem: MenuItem = {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      description: menu.description,
      image: menu.image,
      options: [
        {
          name: 'Boisson',
          choices: ['Coca-Cola', 'Fanta', 'Sprite', 'Ice Tea'],
          multiSelect: false,
          defaultChoice: 'Coca-Cola'
        }
      ]
    };

    this.openItemDetails(menuItem);
  }

  openItemDetails(item: MenuItem): void {
    const dialogRef = this.dialog.open(MenuItemDetailComponent, {
      width: '500px',
      maxHeight: '90vh',
      autoFocus: false,
      data: { item },
      panelClass: 'scrollable-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const cartItem = {
          id: `${this.restaurant?.id}-${item.id}`,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: result.quantity,
          selectedOptions: result.selectedOptions
        };
        
        this.cartService.addToCart(cartItem);
      }
    });
  }
} 