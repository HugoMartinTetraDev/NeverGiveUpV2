import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';

/**
 * Directive pour contrôler l'affichage des éléments de l'UI en fonction des permissions
 * Exemple d'utilisation:
 * <button *appHasPermission="'canManageUsers'">Gérer les utilisateurs</button>
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private permission: string = '';
  private isHidden = true;

  @Input() set appHasPermission(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    if (!this.permission) {
      return;
    }

    // Vérifier si la méthode de permission existe dans le service d'autorisation
    const authService = this.authorizationService as any; // Contourner les vérifications de type pour l'accès dynamique
    
    if (typeof authService[this.permission] === 'function') {
      // Exécuter la méthode de permission
      const hasPermission = authService[this.permission]();

      if (hasPermission && this.isHidden) {
        // Si l'utilisateur a la permission et que le contenu est caché, on l'affiche
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      } else if (!hasPermission && !this.isHidden) {
        // Si l'utilisateur n'a pas la permission et que le contenu est visible, on le cache
        this.viewContainer.clear();
        this.isHidden = true;
      }
    } else {
      console.warn(`La permission '${this.permission}' n'existe pas dans le service d'autorisation`);
      this.viewContainer.clear();
      this.isHidden = true;
    }
  }
} 