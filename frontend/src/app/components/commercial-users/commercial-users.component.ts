import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserRole } from '../../models/user.model';
import { Injectable } from '@angular/core';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UserFormBuilder {
  constructor(private fb: FormBuilder) {}

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      referralCode: ['', Validators.required],
      status: ['Actif', Validators.required]
    });
  }
}

@Component({
  selector: 'app-commercial-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DeleteUserDialogComponent
  ],
  templateUrl: './commercial-users.component.html',
  styleUrls: ['./commercial-users.component.scss']
})
export class CommercialUsersComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  isEditing = false;
  displayedColumns: string[] = ['id', 'name', 'birthDate', 'status', 'action'];
  userForm: FormGroup;

  constructor(
    private formBuilder: UserFormBuilder,
    private dialog: MatDialog
  ) {
    this.userForm = this.formBuilder.createForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Mock data matching the mockup
    this.users = [
      {
        id: 1,
        firstName: 'Jhon',
        lastName: 'DOE',
        birthDate: new Date('1990-01-01'),
        email: 'jhon.doe@example.com',
        address: '24 Le Paquebot',
        referralCode: '1234-5678',
        status: 'Actif',
        roles: [UserRole.CUSTOMER]
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'DOE',
        birthDate: new Date('1990-01-01'),
        email: 'jane.doe@example.com',
        address: '24 Le Paquebot',
        referralCode: '1234-5679',
        status: 'Suspendu',
        roles: [UserRole.CUSTOMER]
      }
    ];
  }

  showUserDetails(user: User): void {
    this.selectedUser = user;
    this.isEditing = false;
  }

  editUser(): void {
    if (this.selectedUser) {
      // Initialize form with the selected user's data
      this.userForm.patchValue({
        firstName: this.selectedUser.firstName,
        lastName: this.selectedUser.lastName,
        birthDate: this.selectedUser.birthDate,
        email: this.selectedUser.email,
        address: this.selectedUser.address,
        referralCode: this.selectedUser.referralCode,
        status: this.selectedUser.status
      });
      this.isEditing = true;
    }
  }

  saveUser(): void {
    if (this.selectedUser && this.userForm.valid) {
      const formValue = this.userForm.value;
      
      const updatedUser: User = {
        ...this.selectedUser,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        birthDate: formValue.birthDate,
        email: formValue.email,
        address: formValue.address,
        referralCode: formValue.referralCode,
        status: formValue.status,
        roles: [UserRole.CUSTOMER]
      };

      const index = this.users.findIndex(u => u.id === this.selectedUser?.id);
      
      if (index !== -1) {
        // Update existing user
        this.users = [
          ...this.users.slice(0, index),
          updatedUser,
          ...this.users.slice(index + 1)
        ];
      } else {
        // Add new user
        this.users = [...this.users, updatedUser];
      }
      
      this.selectedUser = null; // Clear selection after save
      this.isEditing = false;
      this.userForm.reset(); // Reset form after save
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (!this.users.find(u => u.id === this.selectedUser?.id)) {
      // If canceling a new user creation, clear selection
      this.selectedUser = null;
    }
  }

  deleteUser(): void {
    if (this.selectedUser) {
      const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.users = this.users.filter(u => u.id !== this.selectedUser?.id);
          this.selectedUser = null;
        }
      });
    }
  }

  addUser(): void {
    const maxId = Math.max(...this.users.map(u => u.id), 0);
    this.selectedUser = {
      id: maxId + 1,
      firstName: '',
      lastName: '',
      birthDate: new Date(),
      email: '',
      address: '',
      referralCode: '',
      status: 'Actif',
      roles: [UserRole.CUSTOMER]
    };
    
    // Reset form with initial values
    this.userForm.reset({
      firstName: '',
      lastName: '',
      birthDate: new Date(),
      email: '',
      address: '',
      referralCode: '',
      status: 'Actif'
    });
    
    this.isEditing = true;
  }
} 