import { Routes } from '@angular/router';
import { CustomerPurchaseComponent } from './components/customer-purchase/customer-purchase.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileUpdateComponent } from './components/profile/profile-update/profile-update.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderViewComponent } from './components/orders/order-view/order-view.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { RestaurateurOrdersComponent } from './components/restaurateur-orders/restaurateur-orders.component';
import { LoginComponent } from './pages/login/login.component';
import { RestaurateurProfileComponent } from './components/restaurateur-profile/restaurateur-profile.component';
import { RestaurateurProfileUpdateComponent } from './components/restaurateur-profile/restaurateur-profile-update/restaurateur-profile-update.component';
import { DelivererOrdersComponent } from './components/deliverer-orders/deliverer-orders.component';
import { DelivererProfileComponent } from './components/deliverer-profile/deliverer-profile.component';
import { DelivererProfileUpdateComponent } from './components/deliverer-profile/deliverer-profile-update/deliverer-profile-update.component';
import { CommercialOrdersComponent } from './components/commercial-orders/commercial-orders.component';
import { CommercialUsersComponent } from './components/commercial-users/commercial-users.component';
import { DevComponentsComponent } from './components/dev-components/dev-components.component';
import { DeveloperProfileComponent } from './components/developer-profile/developer-profile.component';
import { DeveloperProfileUpdateComponent } from './components/developer-profile/developer-profile-update/developer-profile-update.component';
import { TechComponentsComponent } from './components/tech-components/tech-components.component';
import { TechLogsComponent } from './components/tech-logs/tech-logs.component';
import { LandingComponent } from './pages/landing/landing.component';
import { RestaurateurMenuManagementComponent } from './components/restaurateur-menu-management/restaurateur-menu-management/restaurateur-menu-management.component';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  
  // Routes Client
  { 
    path: 'customer-purchase', 
    component: CustomerPurchaseComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.CLIENT, UserRole.ADMIN] }
  },
  { 
    path: 'compte', 
    component: ProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.CLIENT, UserRole.ADMIN] }
  },
  { 
    path: 'compte/modifier', 
    component: ProfileUpdateComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.CLIENT, UserRole.ADMIN] }
  },
  { 
    path: 'commandes', 
    component: OrdersComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.CLIENT, UserRole.ADMIN] }
  },
  { 
    path: 'commandes/:id', 
    component: OrderViewComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.CLIENT, UserRole.ADMIN] }
  },
  { 
    path: 'checkout', 
    component: CheckoutComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.CLIENT, UserRole.ADMIN] }
  },
  { 
    path: 'order-confirmation', 
    component: OrderConfirmationComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.CLIENT, UserRole.ADMIN] }
  },
  { 
    path: 'restaurant/:id', 
    component: RestaurantDetailComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.CLIENT, UserRole.ADMIN] }
  },
  
  // Routes Restaurateur
  { 
    path: 'restaurateur/compte', 
    component: RestaurateurProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.RESTAURATEUR, UserRole.ADMIN] }
  },
  { 
    path: 'restaurateur/compte/modifier', 
    component: RestaurateurProfileUpdateComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.RESTAURATEUR, UserRole.ADMIN] }
  },
  { 
    path: 'restaurateur/menu-management', 
    component: RestaurateurMenuManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.RESTAURATEUR, UserRole.ADMIN] }
  },
  { 
    path: 'restaurateur/commandes', 
    component: RestaurateurOrdersComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.RESTAURATEUR, UserRole.ADMIN] }
  },
  { 
    path: 'restaurateur/commercial-orders', 
    component: CommercialOrdersComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.RESTAURATEUR, UserRole.ADMIN] }
  },
  { 
    path: 'restaurateur/commercial-users', 
    component: CommercialUsersComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.RESTAURATEUR, UserRole.ADMIN] }
  },
  { 
    path: 'restaurateur/statistiques', 
    component: StatisticsComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.RESTAURATEUR, UserRole.ADMIN] }
  },
  
  // Routes Livreur
  { 
    path: 'deliverer/compte', 
    component: DelivererProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.LIVREUR, UserRole.ADMIN] }
  },
  { 
    path: 'deliverer/compte/modifier', 
    component: DelivererProfileUpdateComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.LIVREUR, UserRole.ADMIN] }
  },
  { 
    path: 'deliverer/commandes', 
    component: DelivererOrdersComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.LIVREUR, UserRole.ADMIN] }
  },
  
  // Routes Développeur (Admin)
  { 
    path: 'developer/compte', 
    component: DeveloperProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  { 
    path: 'developer/compte/modifier', 
    component: DeveloperProfileUpdateComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  { 
    path: 'dev', 
    component: DevComponentsComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  
  // Routes techniques (Admin)
  { 
    path: 'tech', 
    component: TechComponentsComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  { 
    path: 'tech/logs', 
    component: TechLogsComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  { 
    path: 'tech/storage-reset', 
    loadComponent: () => import('./components/tech-tools/storage-reset/storage-reset.component').then(m => m.StorageResetComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  
  { path: '**', redirectTo: '' }
];
