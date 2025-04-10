import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface DevComponent {
  id: string;
  name: string;
  description: string;
  image: string;
  githubLink: string;
}

@Component({
  selector: 'app-tech-component-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './tech-component-update.component.html',
  styleUrls: ['./tech-component-update.component.scss']
})
export class TechComponentUpdateComponent implements OnInit {
  component: Partial<DevComponent> = {};

  constructor(
    private dialogRef: MatDialogRef<TechComponentUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { component?: DevComponent }
  ) {}

  ngOnInit(): void {
    if (this.data.component) {
      this.component = { ...this.data.component };
    }
  }

  onSave(): void {
    this.dialogRef.close(this.component);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.component.image = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.component.image = undefined;
  }
} 