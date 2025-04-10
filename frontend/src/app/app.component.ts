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
    });
  }

  ngOnInit(): void {
    // Surveiller les changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      console.log("Utilisateur détecté dans app.component:", user);
      
      // Si l'utilisateur est connecté et qu'on n'est pas sur la page de connexion, on ouvre le sidenav
      if (user && !this.isLoginPage) {
        console.log("Utilisateur connecté, on va ouvrir le sidenav");
        
        // Attendre que le sidenav soit disponible
        setTimeout(() => {
          if (this.sidenav) {
            console.log("Ouverture du sidenav");
            this.sidenav.open();
          } else {
            console.log("Sidenav non disponible");
          }
        }, 500);
      }
    });
  }

  ngAfterViewInit(): void {
    console.log("AfterViewInit, sidenav:", this.sidenav);
    // Après le chargement complet de la vue, vérifier si on doit ouvrir le sidenav
    setTimeout(() => {
      const user = this.authService.currentUser;
      if (user && this.sidenav && !this.isLoginPage) {
        console.log("Ouverture du sidenav après chargement de la vue");
        this.sidenav.open();
      }
    }, 1000);
  }

  toggleCart() {
    this.isCartVisible = !this.isCartVisible;
  }
}
