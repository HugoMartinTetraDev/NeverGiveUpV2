import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { TechComponentUpdateComponent } from './tech-component-update/tech-component-update.component';

interface DevComponent {
  id: string;
  name: string;
  description: string;
  image: string;
  githubLink: string;
}

@Component({
  selector: 'app-tech-component-card',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './tech-component-card.component.html',
  styleUrls: ['./tech-component-card.component.scss']
})
export class TechComponentCardComponent {
  @Input() component!: DevComponent;
  @Output() edit = new EventEmitter<DevComponent>();
  @Output() delete = new EventEmitter<DevComponent>();

  constructor(private dialog: MatDialog) {}

  onEdit(): void {
    const dialogRef = this.dialog.open(TechComponentUpdateComponent, {
      width: '600px',
      data: { component: this.component }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.edit.emit(result);
      }
    });
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete.emit(this.component);
      }
    });
  }
}
