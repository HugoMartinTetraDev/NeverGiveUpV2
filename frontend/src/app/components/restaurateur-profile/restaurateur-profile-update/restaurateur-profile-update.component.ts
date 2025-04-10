import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface RestaurateurProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  companyName: string;
  siretNumber: string;
  accountHolder: string;
  iban: string;
  deliveryFee: string;
}

@Component({
  selector: 'app-menus-update',
  templateUrl: './restaurateur-profile-update.component.html',
  styleUrls: ['./restaurateur-profile-update.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ]
})
export class RestaurateurProfileUpdateComponent implements OnInit {
  restaurateurProfile: RestaurateurProfile = {
    firstName: 'Jhon',
    lastName: 'Doe',
    birthDate: '01/01/2020',
    email: 'cesi@cesi.Fr',
    password: '**********',
    address: '24 Le Paquebot',
    phoneNumber: '+33 6 00 00 00 00',
    companyName: "L'escale",
    siretNumber: '012 345 678 90123',
    accountHolder: 'Jhon DOE',
    iban: 'FR76 3000 4028 3798 7654 3210 943',
    deliveryFee: '6.00 €'
  };

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onSave(): void {
    console.log('Save restaurateur profile:', this.restaurateurProfile);
    this.router.navigate(['/restaurateur/compte']);
  }

  onCancel(): void {
    this.router.navigate(['/restaurateur/compte']);
  }
} 