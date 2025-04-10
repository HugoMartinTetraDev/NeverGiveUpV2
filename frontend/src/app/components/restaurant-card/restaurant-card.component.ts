import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

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
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss']
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
  @Output() detailsClick = new EventEmitter<void>();

  onDetailsClick(): void {
    this.detailsClick.emit();
  }
}
