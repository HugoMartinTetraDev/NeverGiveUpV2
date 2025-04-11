import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { SearchService } from '../../services/search.service';
import { Observable, map, of, combineLatest } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Restaurant } from '../../models/restaurant.model';

interface Menu {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  items: any[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  options?: {
    name: string;
    choices: string[];
    multiSelect: boolean;
    defaultChoice: string;
  }[];
}

@Component({
  selector: 'app-customer-purchase',
  standalone: true,
  imports: [
    CommonModule, 
    RestaurantCardComponent,
    MatIconModule
  ],
  templateUrl: './customer-purchase.component.html',
  styleUrls: ['./customer-purchase.component.scss']
})
export class CustomerPurchaseComponent implements OnInit {
  restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'GoMiam',
      location: 'Saint-Nazaire',
      description: 'Miam !',
      image: 'assets/images/restaurant1.png',
      deliveryFee: 2.00,
      freeDelivery: false,
      menus: [
        {
          id: '1',
          name: 'Menu Classique',
          price: 12.50,
          description: 'Burger + Frites + Boisson',
          image: 'assets/images/classic-menu.png',
          items: []
        },
        {
          id: '2',
          name: 'Menu Maxi',
          price: 15.00,
          description: 'Double Burger + Frites + Boisson',
          image: 'assets/images/maxi-menu.png',
          items: []
        }
      ],
      articles: [
        {
          id: '1',
          name: 'Cheeseburger',
          price: 6.50,
          description: 'Pain brioché, steak haché, cheddar, salade, tomate',
          image: 'assets/images/cheeseburger.png'
        },
        {
          id: '2',
          name: 'Frites',
          price: 3.00,
          description: 'Frites maison avec sauce au choix',
          image: 'assets/images/fries.png',
          options: [
            {
              name: 'Sauce',
              choices: ['Ketchup', 'Mayonnaise', 'Barbecue', 'Samouraï'],
              multiSelect: false,
              defaultChoice: 'Ketchup'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'ExpressFood',
      location: 'Nantes',
      description: 'Rapide et délicieux !',
      image: 'assets/images/restaurant2.png',
      freeDelivery: true,
      menus: [
        {
          id: '1',
          name: 'Menu Pizza',
          price: 14.00,
          description: 'Pizza + Boisson + Dessert',
          image: 'assets/images/pizza-menu.png',
          items: []
        },
        {
          id: '2',
          name: 'Menu Pasta',
          price: 13.50,
          description: 'Pâtes + Boisson + Dessert',
          image: 'assets/images/pasta-menu.png',
          items: []
        }
      ],
      articles: [
        {
          id: '1',
          name: 'Pizza Margherita',
          price: 9.50,
          description: 'Sauce tomate, mozzarella, basilic',
          image: 'assets/images/margherita.png'
        },
        {
          id: '2',
          name: 'Pâtes Carbonara',
          price: 8.50,
          description: 'Pâtes fraîches, lardons, crème, parmesan',
          image: 'assets/images/carbonara.png'
        }
      ]
    }
  ];

  filteredRestaurants$: Observable<Restaurant[]> = of(this.restaurants);

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.filteredRestaurants$ = combineLatest([
      this.searchService.currentSearchTerm,
      this.searchService.currentCityTerm
    ]).pipe(
      map(([searchTerm, cityTerm]) => {
        let filtered = this.restaurants;

        // Filter by city
        if (cityTerm) {
          const city = cityTerm.toLowerCase();
          filtered = filtered.filter(restaurant => 
            restaurant.location.toLowerCase().includes(city)
          );
        }

        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(restaurant => 
            restaurant.name.toLowerCase().includes(term) ||
            restaurant.description.toLowerCase().includes(term)
          );
        }

        return filtered;
      })
    );
  }

  onRestaurantSelected(restaurantId: string): void {
    this.router.navigate(['/restaurant', restaurantId]);
  }
}
