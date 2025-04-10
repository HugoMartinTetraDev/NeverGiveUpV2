import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { Restaurant, Menu, MenuItem } from '../models/restaurant.model';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private restaurantSubject = new BehaviorSubject<Restaurant | null>(null);
  public restaurant$ = this.restaurantSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  /**
   * Récupère la liste de tous les restaurants
   */
  getRestaurants(): Observable<Restaurant[]> {
    return this.apiService.get<Restaurant[]>('restaurants');
  }

  /**
   * Récupère les détails d'un restaurant par son ID
   */
  getRestaurantById(id: string): Observable<Restaurant> {
    return this.apiService.get<Restaurant>(`restaurants/${id}`).pipe(
      tap(restaurant => this.restaurantSubject.next(restaurant)),
      catchError(error => {
        this.notificationService.error(`Erreur lors de la récupération du restaurant: ${error.message}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crée un nouveau restaurant
   */
  createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.apiService.post<Restaurant>('restaurants', restaurant).pipe(
      tap(newRestaurant => {
        this.notificationService.success('Restaurant créé avec succès');
        return newRestaurant;
      }),
      catchError(error => {
        this.notificationService.error(`Erreur lors de la création du restaurant: ${error.message}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Met à jour un restaurant existant
   */
  updateRestaurant(id: string, restaurant: Partial<Restaurant>): Observable<Restaurant> {
    return this.apiService.put<Restaurant>(`restaurants/${id}`, restaurant).pipe(
      tap(updatedRestaurant => {
        if (this.restaurantSubject.value?.id === id) {
          this.restaurantSubject.next(updatedRestaurant);
        }
        this.notificationService.success('Restaurant mis à jour avec succès');
        return updatedRestaurant;
      }),
      catchError(error => {
        this.notificationService.error(`Erreur lors de la mise à jour du restaurant: ${error.message}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Supprime un restaurant
   */
  deleteRestaurant(id: string): Observable<void> {
    return this.apiService.delete<void>(`restaurants/${id}`).pipe(
      tap(() => {
        if (this.restaurantSubject.value?.id === id) {
          this.restaurantSubject.next(null);
        }
        this.notificationService.success('Restaurant supprimé avec succès');
      }),
      catchError(error => {
        this.notificationService.error(`Erreur lors de la suppression du restaurant: ${error.message}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère les statistiques d'un restaurant
   */
  getRestaurantStatistics(id: string): Observable<any> {
    return this.apiService.get<any>(`restaurants/${id}/statistics`);
  }

  // Méthodes pour les menus
  /**
   * Récupère les menus d'un restaurant
   */
  getMenus(restaurantId: string): Observable<Menu[]> {
    return this.apiService.get<Menu[]>(`restaurants/${restaurantId}/menu`);
  }

  /**
   * Crée un nouveau menu
   */
  createMenu(restaurantId: string, menu: Menu): Observable<Menu> {
    return this.apiService.post<Menu>(`restaurants/${restaurantId}/menu`, menu).pipe(
      tap(newMenu => {
        this.notificationService.success('Menu créé avec succès');
        // Mettre à jour le restaurant en mémoire si c'est celui actuellement consulté
        if (this.restaurantSubject.value?.id === restaurantId) {
          const currentRestaurant = this.restaurantSubject.value;
          this.restaurantSubject.next({
            ...currentRestaurant,
            menus: [...currentRestaurant.menus, newMenu]
          });
        }
        return newMenu;
      })
    );
  }

  /**
   * Met à jour un menu
   */
  updateMenu(restaurantId: string, menu: Menu): Observable<Menu> {
    return this.apiService.put<Menu>(`restaurants/${restaurantId}/menu/${menu.id}`, menu).pipe(
      tap(updatedMenu => {
        this.notificationService.success('Menu mis à jour avec succès');
        // Mettre à jour le restaurant en mémoire si c'est celui actuellement consulté
        if (this.restaurantSubject.value?.id === restaurantId) {
          const currentRestaurant = this.restaurantSubject.value;
          const updatedMenus = currentRestaurant.menus.map(m => 
            m.id === menu.id ? updatedMenu : m
          );
          this.restaurantSubject.next({
            ...currentRestaurant,
            menus: updatedMenus
          });
        }
        return updatedMenu;
      })
    );
  }

  /**
   * Supprime un menu
   */
  deleteMenu(restaurantId: string, menuId: string): Observable<void> {
    return this.apiService.delete<void>(`restaurants/${restaurantId}/menu/${menuId}`).pipe(
      tap(() => {
        this.notificationService.success('Menu supprimé avec succès');
        // Mettre à jour le restaurant en mémoire si c'est celui actuellement consulté
        if (this.restaurantSubject.value?.id === restaurantId) {
          const currentRestaurant = this.restaurantSubject.value;
          this.restaurantSubject.next({
            ...currentRestaurant,
            menus: currentRestaurant.menus.filter(m => m.id !== menuId)
          });
        }
      })
    );
  }

  // Méthodes pour les articles
  /**
   * Récupère les articles d'un restaurant
   */
  getArticles(restaurantId: string): Observable<MenuItem[]> {
    return this.apiService.get<MenuItem[]>(`restaurants/${restaurantId}/articles`);
  }

  /**
   * Crée un nouvel article
   */
  createArticle(restaurantId: string, article: MenuItem): Observable<MenuItem> {
    return this.apiService.post<MenuItem>(`restaurants/${restaurantId}/articles`, article).pipe(
      tap(newArticle => {
        this.notificationService.success('Article créé avec succès');
        // Mettre à jour le restaurant en mémoire si c'est celui actuellement consulté
        if (this.restaurantSubject.value?.id === restaurantId) {
          const currentRestaurant = this.restaurantSubject.value;
          this.restaurantSubject.next({
            ...currentRestaurant,
            articles: [...currentRestaurant.articles, newArticle]
          });
        }
        return newArticle;
      })
    );
  }

  /**
   * Met à jour un article
   */
  updateArticle(restaurantId: string, article: MenuItem): Observable<MenuItem> {
    return this.apiService.put<MenuItem>(`restaurants/${restaurantId}/articles/${article.id}`, article).pipe(
      tap(updatedArticle => {
        this.notificationService.success('Article mis à jour avec succès');
        // Mettre à jour le restaurant en mémoire si c'est celui actuellement consulté
        if (this.restaurantSubject.value?.id === restaurantId) {
          const currentRestaurant = this.restaurantSubject.value;
          const updatedArticles = currentRestaurant.articles.map(a => 
            a.id === article.id ? updatedArticle : a
          );
          this.restaurantSubject.next({
            ...currentRestaurant,
            articles: updatedArticles
          });
        }
        return updatedArticle;
      })
    );
  }

  /**
   * Supprime un article
   */
  deleteArticle(restaurantId: string, articleId: string): Observable<void> {
    return this.apiService.delete<void>(`restaurants/${restaurantId}/articles/${articleId}`).pipe(
      tap(() => {
        this.notificationService.success('Article supprimé avec succès');
        // Mettre à jour le restaurant en mémoire si c'est celui actuellement consulté
        if (this.restaurantSubject.value?.id === restaurantId) {
          const currentRestaurant = this.restaurantSubject.value;
          this.restaurantSubject.next({
            ...currentRestaurant,
            articles: currentRestaurant.articles.filter(a => a.id !== articleId)
          });
        }
      })
    );
  }
} 