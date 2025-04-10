import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechComponentCardComponent } from '../tech-component-card/tech-component-cardcomponent';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TechComponentUpdateComponent } from '../tech-component-card/tech-component-update/tech-component-update.component';

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  image: string;
  githubLink: string;
}

@Component({
  selector: 'app-tech-components',
  standalone: true,
  imports: [
    CommonModule, 
    TechComponentCardComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './tech-components.component.html',
  styleUrls: ['./tech-components.component.scss']
})

export class TechComponentsComponent {
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

  constructor(private dialog: MatDialog) {}

  openAddComponentDialog(): void {
    const dialogRef = this.dialog.open(TechComponentUpdateComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Generate a new ID (you might want to implement a more robust ID generation)
        const newComponent: ComponentItem = {
          ...result,
          id: (this.composants.length + 1).toString()
        };
        this.composants.push(newComponent);
      }
    });
  }
}