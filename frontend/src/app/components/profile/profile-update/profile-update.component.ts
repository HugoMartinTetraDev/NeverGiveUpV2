import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  address: string;
  referralCode: string;
}

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ]
})
export class ProfileUpdateComponent implements OnInit {
  userProfile: UserProfile = {
    firstName: 'Jhon',
    lastName: 'Doe',
    birthDate: '01/01/2020',
    email: 'cesi@cesi.Fr',
    password: '**************',
    address: '24 Le Paquebot',
    referralCode: '1345-5678'
  };

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onSave(): void {
    console.log('Save profile:', this.userProfile);
    this.router.navigate(['/compte']);
  }

  onCancel(): void {
    this.router.navigate(['/compte']);
  }
} 