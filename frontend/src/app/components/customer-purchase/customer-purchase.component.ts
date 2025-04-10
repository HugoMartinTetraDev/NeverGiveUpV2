import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { SearchService } from '../../services/search.service';
import { Observable, map, of, combineLatest } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface Restaurant {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  deliveryFee?: number;
  freeDelivery?: boolean;
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
      deliveryFee: 2.00
    },
    {
      id: '2',
      name: 'ExpressFood',
      location: 'Nantes',
      description: 'Rapide et délicieux !',
      image: 'assets/images/restaurant2.png',
      freeDelivery: true
    },
    {
      id: '3',
      name: 'LetsEat',
      location: 'Saint-Nazaire',
      description: 'Lets Eat !',
      image: 'assets/images/restaurant3.jpg',
      freeDelivery: true
    },
    {
      id: '4',
      name: 'FineBouche',
      location: 'Saint-Nazaire',
      description: 'Rafiné pour les fines bouches.',
      image: 'assets/images/restaurant4.png',
      deliveryFee: 3.00
    },
    {
      id: '5',
      name: 'FastYum',
      location: 'Nantes',
      description: 'Large choix !',
      image: 'assets/images/restaurant5.png',
      freeDelivery: true
    },
    {
      id: '6',
      name: 'RapideFood',
      location: 'Nantes',
      description: 'Rapide et délicieux !',
      image: 'assets/images/restaurant6.png',
      freeDelivery: true
    },
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

  showRestaurantDetails(restaurantId: string): void {
    this.router.navigate(['/restaurant', restaurantId]);
  }
}
