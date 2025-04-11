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
    },
    {
      id: '3',
      name: 'LetsEat',
      location: 'Saint-Nazaire',
      description: 'Lets Eat !',
      image: 'assets/images/restaurant3.jpg',
      freeDelivery: true,
      menus: [
        {
          id: '1',
          name: 'Menu Sushi',
          price: 18.00,
          description: '12 pièces de sushi + Soupe + Boisson',
          image: 'assets/images/sushi-menu.png',
          items: []
        },
        {
          id: '2',
          name: 'Menu Bento',
          price: 15.50,
          description: 'Bento + Soupe + Boisson',
          image: 'assets/images/bento-menu.png',
          items: []
        }
      ],
      articles: [
        {
          id: '1',
          name: 'California Roll',
          price: 6.50,
          description: '6 pièces de sushi au saumon et avocat',
          image: 'assets/images/california-roll.png'
        },
        {
          id: '2',
          name: 'Bento Teriyaki',
          price: 12.00,
          description: 'Poulet teriyaki, riz, légumes, salade',
          image: 'assets/images/teriyaki-bento.png'
        }
      ]
    },
    {
      id: '4',
      name: 'FineBouche',
      location: 'Saint-Nazaire',
      description: 'Rafiné pour les fines bouches.',
      image: 'assets/images/restaurant4.png',
      deliveryFee: 3.00,
      menus: [
        {
          id: '1',
          name: 'Menu Gastronomique',
          price: 25.00,
          description: 'Entrée + Plat + Dessert + Vin',
          image: 'assets/images/gastronomic-menu.png',
          items: []
        },
        {
          id: '2',
          name: 'Menu Découverte',
          price: 20.00,
          description: 'Plat + Dessert + Boisson',
          image: 'assets/images/discovery-menu.png',
          items: []
        }
      ],
      articles: [
        {
          id: '1',
          name: 'Filet de Boeuf',
          price: 18.00,
          description: 'Filet de boeuf, sauce au poivre, gratin dauphinois',
          image: 'assets/images/beef-fillet.png'
        },
        {
          id: '2',
          name: 'Tarte Tatin',
          price: 7.00,
          description: 'Tarte tatin aux pommes, glace vanille',
          image: 'assets/images/tarte-tatin.png'
        }
      ]
    },
    {
      id: '5',
      name: 'FastYum',
      location: 'Nantes',
      description: 'Large choix !',
      image: 'assets/images/restaurant5.png',
      freeDelivery: true,
      menus: [
        {
          id: '1',
          name: 'Menu Tacos',
          price: 11.00,
          description: 'Tacos + Frites + Boisson',
          image: 'assets/images/tacos-menu.png',
          items: []
        },
        {
          id: '2',
          name: 'Menu Kebab',
          price: 10.50,
          description: 'Kebab + Frites + Boisson',
          image: 'assets/images/kebab-menu.png',
          items: []
        }
      ],
      articles: [
        {
          id: '1',
          name: 'Tacos XL',
          price: 7.50,
          description: 'Viande au choix, frites, sauce, fromage',
          image: 'assets/images/tacos-xl.png',
          options: [
            {
              name: 'Viande',
              choices: ['Poulet', 'Boeuf', 'Mixte'],
              multiSelect: false,
              defaultChoice: 'Poulet'
            },
            {
              name: 'Sauce',
              choices: ['Blanche', 'Algérienne', 'Samouraï', 'Barbecue'],
              multiSelect: false,
              defaultChoice: 'Blanche'
            }
          ]
        },
        {
          id: '2',
          name: 'Kebab',
          price: 6.50,
          description: 'Pain pita, viande, salade, tomate, oignon',
          image: 'assets/images/kebab.png',
          options: [
            {
              name: 'Sauce',
              choices: ['Blanche', 'Algérienne', 'Samouraï', 'Barbecue'],
              multiSelect: false,
              defaultChoice: 'Blanche'
            }
          ]
        }
      ]
    },
    {
      id: '6',
      name: 'RapideFood',
      location: 'Nantes',
      description: 'Rapide et délicieux !',
      image: 'assets/images/restaurant6.png',
      freeDelivery: true,
      menus: [
        {
          id: '1',
          name: 'Menu Salade',
          price: 12.00,
          description: 'Salade + Boisson + Dessert',
          image: 'assets/images/salad-menu.png',
          items: []
        },
        {
          id: '2',
          name: 'Menu Sandwich',
          price: 10.50,
          description: 'Sandwich + Frites + Boisson',
          image: 'assets/images/sandwich-menu.png',
          items: []
        }
      ],
      articles: [
        {
          id: '1',
          name: 'César Salad',
          price: 8.00,
          description: 'Salade, poulet, parmesan, croûtons, sauce césar',
          image: 'assets/images/cesar-salad.png'
        },
        {
          id: '2',
          name: 'Club Sandwich',
          price: 6.50,
          description: 'Pain de mie, poulet, bacon, salade, tomate',
          image: 'assets/images/club-sandwich.png'
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
