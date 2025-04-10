import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Restaurant, Menu, MenuItem } from '../../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private restaurant: Restaurant = {
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
        image: 'assets/images/fries.png'
      }
    ]
  };

  private restaurantSubject = new BehaviorSubject<Restaurant>(this.restaurant);

  constructor() {}

  getRestaurant(): Observable<Restaurant> {
    return this.restaurantSubject.asObservable();
  }

  addMenu(menu: Menu): void {
    this.restaurant.menus.push({
      ...menu,
      id: Date.now().toString() // Simple ID generation for demo
    });
    this.restaurantSubject.next(this.restaurant);
  }

  updateMenu(menu: Menu): void {
    const index = this.restaurant.menus.findIndex(m => m.id === menu.id);
    if (index !== -1) {
      this.restaurant.menus[index] = menu;
      this.restaurantSubject.next(this.restaurant);
    }
  }

  deleteMenu(menuId: string): void {
    this.restaurant.menus = this.restaurant.menus.filter(m => m.id !== menuId);
    this.restaurantSubject.next(this.restaurant);
  }

  addArticle(article: MenuItem): void {
    this.restaurant.articles.push({
      ...article,
      id: Date.now().toString() // Simple ID generation for demo
    });
    this.restaurantSubject.next(this.restaurant);
  }

  updateArticle(article: MenuItem): void {
    const index = this.restaurant.articles.findIndex(a => a.id === article.id);
    if (index !== -1) {
      this.restaurant.articles[index] = article;
      this.restaurantSubject.next(this.restaurant);
    }
  }

  deleteArticle(articleId: string): void {
    this.restaurant.articles = this.restaurant.articles.filter(a => a.id !== articleId);
    this.restaurantSubject.next(this.restaurant);
  }

  createMenu(menu: Menu): void {
    menu.id = Date.now().toString();
    this.restaurant.menus.push(menu);
    this.restaurantSubject.next(this.restaurant);
  }

  createArticle(article: MenuItem): void {
    article.id = Date.now().toString();
    this.restaurant.articles.push(article);
    this.restaurantSubject.next(this.restaurant);
  }
} 