import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthService } from './services/auth.service';
import { UserRole } from './models/user.model';

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
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'pop-eat-frontend';
  isCartVisible = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Surveiller les changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      if (user && user.roles && user.roles.includes(UserRole.CUSTOMER)) {
        // Ouvrir automatiquement le sidenav pour les clients après le rendu complet
        setTimeout(() => {
          if (this.sidenav) {
            this.sidenav.open();
          }
        }, 0);
      }
    });
  }

  toggleCart() {
    this.isCartVisible = !this.isCartVisible;
  }
}
