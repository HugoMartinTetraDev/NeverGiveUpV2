import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  icon: string;
  title: string;
  message: string;
  time: string;
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
      time: 'Il y a 2h'
    },
    {
      icon: 'shopping_cart',
      title: 'Commande en cours',
      message: 'Votre commande est en préparation',
      time: 'Il y a 30min'
    },
    {
      icon: 'star',
      title: 'Nouveau restaurant',
      message: 'Un nouveau restaurant vient d\'ouvrir près de chez vous',
      time: 'Il y a 1h'
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
} 