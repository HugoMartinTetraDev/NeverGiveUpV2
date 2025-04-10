import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevComponentCardComponent } from '../dev-component-card/dev-component-cardcomponent';
import { MatIconModule } from '@angular/material/icon';

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  image: string;
  githubLink: string;
}

@Component({
  selector: 'app-dev-components',
  standalone: true,
  imports: [
    CommonModule, 
    DevComponentCardComponent,
    MatIconModule
  ],
  templateUrl: './dev-components.component.html',
  styleUrls: ['./dev-components.component.scss']
})

export class DevComponentsComponent {
  composants : ComponentItem[] = [
    {
      id: '1',
      name: 'Composant Profil',
      description: 'Permet d\'afficher le profil d\'un utilisateur',
      image: 'assets/images/component-profil.png',
      githubLink: 'https://github.com/TortueHardie/Advanced-Web-Project/tree/main'
    },
    {
      id: '2',
      name: 'Composant liste de restaurants',
      description: 'Permet d\'afficher une liste de restaurants',
      image: 'assets/images/component-liste-restaurants.png',
      githubLink: 'https://github.com/TortueHardie/Advanced-Web-Project/tree/main'
    },
    {
      id: '3',
      name: 'Composant carte de restaurant',
      description: 'Permet d\'afficher une carte de restaurant avec les menus et les articles',
      image: 'assets/images/component-card.png',
      githubLink: 'https://github.com/TortueHardie/Advanced-Web-Project/tree/main'
    },
    {
      id: '4',
      name: 'Composant panier',
      description: 'Affiche le panier d\'un utilisateur',
      image: 'assets/images/component-panier.png',
      githubLink: 'https://github.com/TortueHardie/Advanced-Web-Project/tree/main'
    },
  ];
}