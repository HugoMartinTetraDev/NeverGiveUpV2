import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Restaurant, Menu, MenuItem } from '../../models/restaurant.model';
import { CartService } from '../../services/mocked/cart.service';
import { MenuItemDetailComponent } from '../menu-item-detail/menu-item-detail.component';

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
  restaurant: Restaurant = {
    id: '1',
    name: 'Pop-Eat',
    menus: [
      {
        id: '1',
        name: 'Royal Menu',
        price: 13.00,
        description: 'Royal Burger + Frites + Boisson',
        image: 'assets/images/royal-menu.png',
        items: []
      },
      {
        id: '2',
        name: 'American Menu',
        price: 12.00,
        description: 'American Burger + Frites + Boisson',
        image: 'assets/images/american-menu.png',
        items: []
      },
      {
        id: '3',
        name: 'QuiPique Menu',
        price: 13.50,
        description: 'QuiPiqueBurger + Frites + Boisson',
        image: 'assets/images/quipique-menu.png',
        items: []
      }
    ],
    articles: [
      {
        id: '1',
        name: 'Big Burger',
        price: 8.00,
        description: '200g de viande, salade, tomate, bacon...',
        image: 'assets/images/big-burger.png'
      },
      {
        id: '2',
        name: 'Tacos poulet',
        price: 7.50,
        description: 'Poulet, frites, poivron, sauce blanche...',
        image: 'assets/images/tacos-poulet.png'
      },
      {
        id: '3',
        name: 'Frites',
        price: 2.00,
        description: 'Sauce au choix',
        image: 'assets/images/fries.png',
        options: [
          {
            name: 'Sauce',
            choices: ['Blanche', 'Ketchup', 'Algérienne', 'Samouraï'],
            multiSelect: false,
            defaultChoice: 'Blanche'
          }
        ]
      }
    ]
  };

  constructor(
    private dialog: MatDialog,
    private cartService: CartService
  ) {}

  ngOnInit(): void {}

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
          id: `${this.restaurant.id}-${item.id}`,
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