import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile-delete-dialog',
  templateUrl: './profile-delete-dialog.component.html',
  styleUrls: ['./profile-delete-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ProfileDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ProfileDeleteDialogComponent>
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 