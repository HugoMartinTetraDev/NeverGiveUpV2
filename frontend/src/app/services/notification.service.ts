import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  icon: string;
  title: string;
  message: string;
  time: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([
    {
      icon: 'local_offer',
      title: 'Nouvelle offre',
      message: '20% de réduction sur les pizzas',
      time: 'Il y a 2h',
      type: 'info'
    },
    {
      icon: 'shopping_cart',
      title: 'Commande en cours',
      message: 'Votre commande est en préparation',
      time: 'Il y a 30min',
      type: 'info'
    },
    {
      icon: 'star',
      title: 'Nouveau restaurant',
      message: 'Un nouveau restaurant vient d\'ouvrir près de chez vous',
      time: 'Il y a 1h',
      type: 'info'
    }
  ]);

  notifications$ = this.notifications.asObservable();

  addNotification(notification: Notification) {
    const currentNotifications = this.notifications.getValue();
    this.notifications.next([notification, ...currentNotifications]);
  }

  getNotifications() {
    return this.notifications.getValue();
  }

  clearNotifications() {
    this.notifications.next([]);
  }

  /**
   * Affiche une notification de succès
   */
  success(message: string, title: string = 'Succès') {
    this.addNotification({
      icon: 'check_circle',
      title,
      message,
      time: this.getCurrentTime(),
      type: 'success'
    });
  }

  /**
   * Affiche une notification d'erreur
   */
  error(message: string, title: string = 'Erreur') {
    this.addNotification({
      icon: 'error',
      title,
      message,
      time: this.getCurrentTime(),
      type: 'error'
    });
  }

  /**
   * Affiche une notification d'avertissement
   */
  warning(message: string, title: string = 'Attention') {
    this.addNotification({
      icon: 'warning',
      title,
      message,
      time: this.getCurrentTime(),
      type: 'warning'
    });
  }

  /**
   * Affiche une notification d'information
   */
  info(message: string, title: string = 'Information') {
    this.addNotification({
      icon: 'info',
      title,
      message,
      time: this.getCurrentTime(),
      type: 'info'
    });
  }

  /**
   * Récupère l'heure actuelle formatée
   */
  private getCurrentTime(): string {
    return 'À l\'instant';
  }
} 