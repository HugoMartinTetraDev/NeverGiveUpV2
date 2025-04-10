import { Directive, Input, OnInit, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';
import { UserRole } from '../models/user.model';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  private roles: UserRole[] = [];
  private isHidden = true;

  @Input() set appHasRole(roles: UserRole | UserRole[]) {
    // Conversion en tableau si c'est une seule valeur
    this.roles = Array.isArray(roles) ? roles : [roles];
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
    // Vérifier si l'utilisateur a au moins un des rôles requis
    const hasRole = this.authorizationService.hasAnyRole(this.roles);

    if (hasRole && this.isHidden) {
      // Si l'utilisateur a les droits et que le contenu est caché, on l'affiche
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isHidden = false;
    } else if (!hasRole && !this.isHidden) {
      // Si l'utilisateur n'a pas les droits et que le contenu est visible, on le cache
      this.viewContainer.clear();
      this.isHidden = true;
    }
  }
} 