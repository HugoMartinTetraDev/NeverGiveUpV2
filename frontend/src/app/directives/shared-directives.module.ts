import { NgModule } from '@angular/core';
import { HasRoleDirective } from './has-role.directive';
import { HasPermissionDirective } from './has-permission.directive';

/**
 * Module regroupant toutes les directives d'autorisation partagées
 */
@NgModule({
  imports: [
    HasRoleDirective,
    HasPermissionDirective
  ],
  exports: [
    HasRoleDirective,
    HasPermissionDirective
  ]
})
export class SharedDirectivesModule {} 