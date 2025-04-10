import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DevComponent {
  id: string;
  name: string;
  description: string;
  image: string;
  githubLink: string;
}

@Component({
  selector: 'app-dev-component-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dev-component-card.component.html',
  styleUrls: ['./dev-component-card.component.scss']
})
export class DevComponentCardComponent {
  @Input() component!: DevComponent;
  @Output() detailsClick = new EventEmitter<void>();

  onDetailsClick(): void {
    this.detailsClick.emit();
  }
}
