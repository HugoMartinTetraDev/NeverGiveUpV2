import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  restaurantId: string;
  items: MenuItem[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MenuManagementService {
  private mockMenus: Menu[] = [
    {
      id: '1',
      name: 'Main Menu',
      description: 'Our main selection of dishes',
      restaurantId: '1',
      items: [
        {
          id: '1',
          name: 'Classic Burger',
          description: 'Juicy beef patty with fresh vegetables',
          price: 12.99,
          category: 'Burgers',
          isAvailable: true,
          restaurantId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() { }

  getMenusByRestaurant(restaurantId: string): Observable<Menu[]> {
    return of(this.mockMenus.filter(menu => menu.restaurantId === restaurantId));
  }

  getMenu(menuId: string): Observable<Menu | undefined> {
    return of(this.mockMenus.find(menu => menu.id === menuId));
  }

  createMenu(menu: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>): Observable<Menu> {
    const newMenu: Menu = {
      ...menu,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockMenus.push(newMenu);
    return of(newMenu);
  }

  updateMenu(menu: Menu): Observable<Menu> {
    const index = this.mockMenus.findIndex(m => m.id === menu.id);
    if (index !== -1) {
      this.mockMenus[index] = { ...menu, updatedAt: new Date() };
    }
    return of(menu);
  }

  deleteMenu(menuId: string): Observable<boolean> {
    const index = this.mockMenus.findIndex(menu => menu.id === menuId);
    if (index !== -1) {
      this.mockMenus.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  addMenuItem(menuId: string, item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Observable<MenuItem> {
    const menu = this.mockMenus.find(m => m.id === menuId);
    if (menu) {
      const newItem: MenuItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      menu.items.push(newItem);
      return of(newItem);
    }
    throw new Error('Menu not found');
  }

  updateMenuItem(menuId: string, item: MenuItem): Observable<MenuItem> {
    const menu = this.mockMenus.find(m => m.id === menuId);
    if (menu) {
      const index = menu.items.findIndex(i => i.id === item.id);
      if (index !== -1) {
        menu.items[index] = { ...item, updatedAt: new Date() };
        return of(menu.items[index]);
      }
    }
    throw new Error('Menu or item not found');
  }

  deleteMenuItem(menuId: string, itemId: string): Observable<boolean> {
    const menu = this.mockMenus.find(m => m.id === menuId);
    if (menu) {
      const index = menu.items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        menu.items.splice(index, 1);
        return of(true);
      }
    }
    return of(false);
  }
} 