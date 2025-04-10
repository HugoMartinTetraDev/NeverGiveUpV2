import { Component, EventEmitter, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { SearchService } from '../../../services/search.service';
import { NotificationService, Notification } from '../../../services/notification.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() menuClick = new EventEmitter<void>();
  @Output() cartClick = new EventEmitter<void>();
  @ViewChild('notificationMenu') notificationMenu!: MatMenu;
  @ViewChild('userMenu') userMenu!: MatMenu;
  @ViewChild('mobileMenu') mobileMenu!: MatMenu;
  searchTerm = '';
  cityTerm = '';
  notifications: Notification[] = [];
  totalCartItems = 0;
  private notificationSubscription: Subscription;
  private cartSubscription: Subscription;
  private authSubscription: Subscription;
  isLoginPage = false;

  constructor(
    private searchService: SearchService,
    private notificationService: NotificationService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.notificationSubscription = this.notificationService.notifications$
      .subscribe(notifications => {
        this.notifications = notifications;
      });
    
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login' || this.router.url === '/';
    });

    // Surveiller les changements d'utilisateur
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (user && user.roles && user.roles.includes(UserRole.CLIENT)) {
        // Émettre l'événement pour ouvrir le menu latéral pour les clients
        // Attendre un peu pour s'assurer que tout est chargé
        setTimeout(() => {
          this.menuClick.emit();
        }, 500);
      }
    });
  }

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  get hasNotifications(): boolean {
    return this.notifications.length > 0;
  }

  get hasCartItems(): boolean {
    return this.totalCartItems > 0;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get currentUser(): any {
    return this.authService.currentUser;
  }

  onSearchChange(term: string) {
    this.searchService.updateSearchTerm(term);
  }

  onCityChange(term: string) {
    this.searchService.updateCityTerm(term);
  }
}
