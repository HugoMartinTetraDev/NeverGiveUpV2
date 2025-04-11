import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
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
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss']
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
  @Output() detailsClick = new EventEmitter<string>();

  onDetailsClick(): void {
    this.detailsClick.emit(this.restaurant.id);
  }
}
