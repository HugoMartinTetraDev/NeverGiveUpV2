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
      name: 'Pizza Palace',
      location: 'Paris',
      description: 'Authentic Italian pizzas made with fresh ingredients',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      deliveryFee: 2.99,
      freeDelivery: false,
      menus: [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Classic tomato sauce, mozzarella, and basil',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
          items: [
            {
              id: '1',
              name: 'Margherita Pizza',
              description: 'Classic tomato sauce, mozzarella, and basil',
              price: 12.99,
              image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
              options: []
            }
          ]
        },
        {
          id: '2',
          name: 'Pepperoni Pizza',
          description: 'Tomato sauce, mozzarella, and pepperoni',
          price: 14.99,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
          items: [
            {
              id: '2',
              name: 'Pepperoni Pizza',
              description: 'Tomato sauce, mozzarella, and pepperoni',
              price: 14.99,
              image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
              options: []
            }
          ]
        }
      ],
      articles: [
        {
          id: '1',
          name: 'Garlic Bread',
          description: 'Freshly baked bread with garlic butter',
          price: 4.99,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
          options: []
        }
      ]
    },
    {
      id: '2',
      name: 'Sushi Master',
      location: 'Tokyo',
      description: 'Fresh and authentic Japanese sushi',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
      deliveryFee: 3.99,
      freeDelivery: true,
      menus: [
        {
          id: '3',
          name: 'Sushi Combo',
          description: 'Assorted sushi pieces with miso soup',
          price: 24.99,
          image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
          items: [
            {
              id: '3',
              name: 'Sushi Combo',
              description: 'Assorted sushi pieces with miso soup',
              price: 24.99,
              image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
              options: []
            }
          ]
        }
      ],
      articles: []
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