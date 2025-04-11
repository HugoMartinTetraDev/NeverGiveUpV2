import { Injectable } from '@angular/core';
import { MenuItem } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockItems: MenuItem[] = [
    {
      id: '1',
      name: 'Classic Burger',
      price: 8.99,
      description: 'Pain brioché, steak haché 100% boeuf, cheddar, salade, tomate, oignon',
      image: 'https://example.com/burger.jpg',
      options: [
        {
          name: 'Cuisson',
          choices: ['Saignant', 'À point', 'Bien cuit'],
          multiSelect: false,
          defaultChoice: 'À point'
        },
        {
          name: 'Suppléments',
          choices: ['Bacon', 'Oeuf', 'Avocat'],
          multiSelect: true,
          defaultChoice: ''
        }
      ]
    },
    {
      id: '2',
      name: 'Cheeseburger',
      price: 9.99,
      description: 'Pain brioché, double steak haché, double cheddar, salade, tomate, oignon',
      image: 'https://example.com/cheeseburger.jpg',
      options: [
        {
          name: 'Cuisson',
          choices: ['Saignant', 'À point', 'Bien cuit'],
          multiSelect: false,
          defaultChoice: 'À point'
        }
      ]
    },
    {
      id: '3',
      name: 'Chicken Burger',
      price: 7.99,
      description: 'Pain brioché, filet de poulet pané, salade, tomate, sauce barbecue',
      image: 'https://example.com/chicken-burger.jpg'
    },
    {
      id: '4',
      name: 'Frites',
      price: 3.99,
      description: 'Frites maison, sel, poivre',
      image: 'https://example.com/fries.jpg',
      options: [
        {
          name: 'Taille',
          choices: ['Petite', 'Moyenne', 'Grande'],
          multiSelect: false,
          defaultChoice: 'Moyenne'
        }
      ]
    },
    {
      id: '5',
      name: 'Coca-Cola',
      price: 2.99,
      description: 'Boisson gazeuse 33cl',
      image: 'https://example.com/coke.jpg',
      options: [
        {
          name: 'Taille',
          choices: ['33cl', '50cl'],
          multiSelect: false,
          defaultChoice: '33cl'
        }
      ]
    },
    {
      id: '6',
      name: 'Tiramisu',
      price: 4.99,
      description: 'Dessert italien au café et mascarpone',
      image: 'https://example.com/tiramisu.jpg'
    }
  ];

  getMockItems(): MenuItem[] {
    return this.mockItems;
  }

  getMockItemsWithSelection(selectedIds: string[] = []): (MenuItem & { selected?: boolean })[] {
    return this.mockItems.map(item => ({
      ...item,
      selected: selectedIds.includes(item.id)
    }));
  }
} 