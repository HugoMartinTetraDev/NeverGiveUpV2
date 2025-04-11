import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Restaurant, Menu, MenuItem } from '../models/restaurant.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private restaurantSubject = new BehaviorSubject<Restaurant | null>(null);
  public restaurant$ = this.restaurantSubject.asObservable();

  private mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Burger King',
      location: 'Paris',
      description: 'Les meilleurs burgers de la ville, préparés avec des ingrédients frais',
      image: 'assets/images/restaurant1.png',
      deliveryFee: 2.99,
      freeDelivery: false,
      menus: [
        {
          id: '1',
          name: 'Menu American',
          description: 'Un délicieux burger accompagné de frites et d\'une boisson',
          price: 12.99,
          image: 'assets/images/american-menu.png',
          items: [
            {
              id: '1',
              name: 'Big Burger',
              description: 'Burger double avec fromage, bacon et sauce spéciale',
              price: 8.99,
              image: 'assets/images/big-burger.png',
              options: []
            },
            {
              id: '2',
              name: 'Frites',
              description: 'Frites maison croustillantes',
              price: 3.99,
              image: 'assets/images/fries.png',
              options: []
            },
            {
              id: '3',
              name: 'Coca-Cola',
              description: 'Boisson gazeuse rafraîchissante',
              price: 2.99,
              image: 'assets/images/cola.jpg',
              options: []
            }
          ]
        },
        {
          id: '2',
          name: 'Menu Royal',
          description: 'Un menu royal avec un burger premium et des accompagnements gourmands',
          price: 15.99,
          image: 'assets/images/burger.png',
          items: [
            {
              id: '4',
              name: 'Royal Burger',
              description: 'Burger avec steak wagyu, foie gras et truffe',
              price: 12.99,
              image: 'assets/images/burger.png',
              options: []
            },
            {
              id: '5',
              name: 'Onion Rings',
              description: 'Rondelles d\'oignon croustillantes',
              price: 4.99,
              image: 'assets/images/onion-rings.png',
              options: []
            },
            {
              id: '6',
              name: 'Milkshake',
              description: 'Milkshake maison au choix',
              price: 5.99,
              image: 'assets/images/milkshake.png',
              options: []
            }
          ]
        }
      ],
      articles: [
        {
          id: '1',
          name: 'Classic Burger',
          description: 'Burger simple avec fromage et sauce maison',
          price: 6.99,
          image: 'assets/images/burger.png',
          options: []
        }
      ]
    },
    {
      id: '2',
      name: 'Kebab Express',
      location: 'Lyon',
      description: 'Kebabs et tacos préparés avec des produits frais',
      image: 'assets/images/restaurant2.png',
      deliveryFee: 3.99,
      freeDelivery: true,
      menus: [
        {
          id: '2',
          name: 'Menu Royal',
          description: 'Kebab royal avec frites et boisson',
          price: 14.99,
          image: 'assets/images/royal-menu.png',
          items: [
            {
              id: '4',
              name: 'Kebab Royal',
              description: 'Kebab avec viande de qualité supérieure',
              price: 9.99,
              image: 'assets/images/kebab.jpg',
              options: []
            },
            {
              id: '5',
              name: 'Frites',
              description: 'Frites maison croustillantes',
              price: 3.99,
              image: 'assets/images/fries.png',
              options: []
            },
            {
              id: '6',
              name: 'Coca-Cola',
              description: 'Boisson gazeuse rafraîchissante',
              price: 2.99,
              image: 'assets/images/cola.jpg',
              options: []
            }
          ]
        },
        {
          id: '3',
          name: 'Menu Quipique',
          description: 'Tacos poulet avec frites et boisson',
          price: 13.99,
          image: 'assets/images/quipique-menu.png',
          items: [
            {
              id: '7',
              name: 'Tacos Poulet',
              description: 'Tacos au poulet mariné',
              price: 8.99,
              image: 'assets/images/tacos-poulet.png',
              options: []
            },
            {
              id: '8',
              name: 'Frites',
              description: 'Frites maison croustillantes',
              price: 3.99,
              image: 'assets/images/fries.png',
              options: []
            },
            {
              id: '9',
              name: 'Coca-Cola',
              description: 'Boisson gazeuse rafraîchissante',
              price: 2.99,
              image: 'assets/images/cola.jpg',
              options: []
            }
          ]
        }
      ],
      articles: [
        {
          id: '3',
          name: 'Kebab Classique',
          description: 'Kebab traditionnel avec viande de boeuf',
          price: 7.99,
          image: 'assets/images/kebab.jpg',
          options: []
        },
        {
          id: '4',
          name: 'Tacos Poulet',
          description: 'Tacos avec viande de boeuf marinée',
          price: 8.99,
          image: 'assets/images/tacos-poulet.png',
          options: []
        }
      ]
    },
    {
      id: '3',
      name: 'Le Bistrot Parisien',
      location: 'Paris',
      description: 'Cuisine française traditionnelle dans un cadre chaleureux',
      image: 'assets/images/restaurant3.jpg',
      deliveryFee: 4.99,
      freeDelivery: false,
      menus: [
        {
          id: '4',
          name: 'Menu Découverte',
          description: 'Une sélection de nos meilleurs plats',
          price: 24.99,
          image: 'assets/images/component-card.png',
          items: [
            {
              id: '10',
              name: 'Entrée du Chef',
              description: 'Assortiment de spécialités maison',
              price: 8.99,
              image: 'assets/images/component-card.png',
              options: []
            },
            {
              id: '11',
              name: 'Plat Principal',
              description: 'Au choix: Boeuf Bourguignon ou Coq au Vin',
              price: 14.99,
              image: 'assets/images/component-card.png',
              options: []
            },
            {
              id: '12',
              name: 'Dessert Maison',
              description: 'Sélection de desserts traditionnels',
              price: 6.99,
              image: 'assets/images/component-card.png',
              options: []
            }
          ]
        }
      ],
      articles: []
    },
    {
      id: '4',
      name: 'Pizza Express',
      location: 'Marseille',
      description: 'Pizzas artisanales cuites au feu de bois',
      image: 'assets/images/restaurant4.png',
      deliveryFee: 2.99,
      freeDelivery: true,
      menus: [],
      articles: [
        {
          id: '13',
          name: 'Pizza Margherita',
          description: 'Tomate, mozzarella, basilic',
          price: 9.99,
          image: 'assets/images/component-card.png',
          options: []
        },
        {
          id: '14',
          name: 'Pizza Reine',
          description: 'Tomate, mozzarella, jambon, champignons',
          price: 11.99,
          image: 'assets/images/component-card.png',
          options: []
        }
      ]
    },
    {
      id: '5',
      name: 'Sushi Bar',
      location: 'Lyon',
      description: 'Sushis frais préparés par nos maîtres sushi',
      image: 'assets/images/restaurant5.png',
      deliveryFee: 3.99,
      freeDelivery: false,
      menus: [],
      articles: [
        {
          id: '15',
          name: 'Assortiment Sushi',
          description: 'Sélection de 12 pièces de sushi variés',
          price: 18.99,
          image: 'assets/images/component-card.png',
          options: []
        },
        {
          id: '16',
          name: 'California Roll',
          description: 'Rouleau de crabe, avocat et concombre',
          price: 12.99,
          image: 'assets/images/component-card.png',
          options: []
        }
      ]
    },
    {
      id: '6',
      name: 'Le Petit Bistro',
      location: 'Bordeaux',
      description: 'Cuisine bistrot traditionnelle',
      image: 'assets/images/restaurant6.png',
      deliveryFee: 2.99,
      freeDelivery: true,
      menus: [],
      articles: [
        {
          id: '17',
          name: 'Steak Frites',
          description: 'Steak de boeuf accompagné de frites maison',
          price: 16.99,
          image: 'assets/images/component-card.png',
          options: []
        },
        {
          id: '18',
          name: 'Salade César',
          description: 'Salade avec poulet grillé, parmesan et croûtons',
          price: 12.99,
          image: 'assets/images/component-card.png',
          options: []
        }
      ]
    }
  ];

  constructor(
    private notificationService: NotificationService
  ) {}

  /**
   * Récupère la liste de tous les restaurants
   */
  getRestaurants(): Observable<Restaurant[]> {
    return of(this.mockRestaurants);
  }

  /**
   * Récupère les détails d'un restaurant par son ID
   */
  getRestaurantById(id: string): Observable<Restaurant> {
    const restaurant = this.mockRestaurants.find(r => r.id === id);
    if (restaurant) {
      this.restaurantSubject.next(restaurant);
      return of(restaurant);
    } else {
      const error = new Error(`Restaurant with ID "${id}" not found`);
      this.notificationService.error(`Erreur lors de la récupération du restaurant: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère le restaurant du restaurateur connecté
   */
  getMyRestaurant(): Observable<Restaurant> {
    // For demo purposes, return the first restaurant
    const restaurant = this.mockRestaurants[0];
    this.restaurantSubject.next(restaurant);
    return of(restaurant);
  }

  /**
   * Crée un nouveau restaurant
   */
  createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Met à jour un restaurant existant
   */
  updateRestaurant(id: string, restaurant: Partial<Restaurant>): Observable<Restaurant> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Supprime un restaurant
   */
  deleteRestaurant(id: string): Observable<void> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Récupère les statistiques d'un restaurant
   */
  getRestaurantStatistics(id: string): Observable<any> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  // Méthodes pour les menus
  /**
   * Récupère les menus d'un restaurant
   */
  getMenus(restaurantId: string): Observable<Menu[]> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Crée un nouveau menu
   */
  createMenu(restaurantId: string, menu: Menu): Observable<Menu> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Met à jour un menu
   */
  updateMenu(restaurantId: string, menu: Menu): Observable<Menu> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Supprime un menu
   */
  deleteMenu(restaurantId: string, menuId: string): Observable<void> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  // Méthodes pour les articles
  /**
   * Récupère les articles d'un restaurant
   */
  getArticles(restaurantId: string): Observable<MenuItem[]> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Crée un nouvel article
   */
  createArticle(restaurantId: string, article: MenuItem): Observable<MenuItem> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Met à jour un article
   */
  updateArticle(restaurantId: string, article: MenuItem): Observable<MenuItem> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  /**
   * Supprime un article
   */
  deleteArticle(restaurantId: string, articleId: string): Observable<void> {
    // Implementation needed
    throw new Error('Method not implemented');
  }
} 