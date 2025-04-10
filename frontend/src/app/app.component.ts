import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthService } from './services/auth.service';
import { UserRole } from './models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
    CartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'pop-eat-frontend';
  isCartVisible = false;
  isLoginPage = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Surveiller les changements de route pour détecter la page de connexion
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      this.isLoginPage = url === '/login' || url === '/register' || url === '/';
      console.log('Navigation vers:', url, 'isLoginPage:', this.isLoginPage);
      
      // Si on navigue vers la page de connexion, fermer le sidenav
      if (this.isLoginPage && this.sidenav && this.sidenav.opened) {
        console.log('Navigation vers la page de connexion, fermeture du sidenav');
        this.sidenav.close();
      }
      
      // Fermer la sidebar après navigation (lorsqu'un élément de menu est sélectionné)
      if (this.sidenav && this.sidenav.opened) {
        this.sidenav.close();
      }
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté au démarrage
    this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          console.log('Utilisateur connecté:', user);
          // Logique additionnelle si nécessaire
        } else {
          console.log('Aucun utilisateur connecté');
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Configuration de la sidebar pour qu'elle se ferme au clic en dehors
    if (this.sidenav) {
      // S'assurer que le mode est configuré pour se fermer au clic en dehors
      this.sidenav.mode = 'over';
      console.log('Sidenav configuré en mode over');
    }
  }

  toggleCart() {
    this.isCartVisible = !this.isCartVisible;
  }
  
  toggleSidebar() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}
