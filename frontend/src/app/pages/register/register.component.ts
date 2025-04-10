import { Component, OnInit, isDevMode } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/mocked/auth.service';
import { finalize } from 'rxjs/operators';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  userRoles = Object.values(UserRole);
  
  // Track which role-specific sections to show
  showRestaurantOwnerFields = false;
  showDelivererFields = false;
  
  // Flag for development features
  isDevelopmentMode = isDevMode();
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.formBuilder.group({
      // Common fields for all users
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9]{10,12}$/)]],
      address: [''],
      city: [''],
      zipCode: [''],
      roles: this.formBuilder.array([]),
      
      // Restaurant owner specific fields
      restaurantName: [''],
      restaurantDescription: [''],
      siretNumber: [''],
      restaurantAddress: [''],
      restaurantCity: [''],
      restaurantZipCode: [''],
      restaurantPhone: [''],
      cuisineType: [''],
      deliveryFee: [''],
      
      // Deliverer specific fields
      delivererPhoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,12}$/)]],
      delivererSiretNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{14}$/)]],
      accountHolderName: ['', [Validators.required]],
      iban: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/)]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Listen for changes to roles to show/hide conditional fields
    this.registerForm.get('roles')?.valueChanges.subscribe(roles => {
      this.updateConditionalValidators(roles);
    });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }
    
    return null;
  }

  updateConditionalValidators(roles: UserRole[]): void {
    // Check if roles contains restaurant owner
    const isRestaurantOwner = roles.includes(UserRole.RESTAURANT_OWNER);
    this.showRestaurantOwnerFields = isRestaurantOwner;
    
    // Update validators for restaurant owner fields
    const restaurantFields = [
      'restaurantName', 'siretNumber', 'restaurantAddress', 
      'restaurantPhone', 'cuisineType', 'deliveryFee'
    ];
    
    restaurantFields.forEach(field => {
      const control = this.registerForm.get(field);
      if (control) {
        if (isRestaurantOwner) {
          control.setValidators([Validators.required]);
        } else {
          control.clearValidators();
          control.setValue('');
        }
        control.updateValueAndValidity();
      }
    });
    
    // Check if roles contains deliverer
    const isDeliverer = roles.includes(UserRole.DELIVERER);
    this.showDelivererFields = isDeliverer;
    
    // Update validators for deliverer fields
    const delivererFields = [
      'delivererPhoneNumber', 'delivererSiretNumber', 'accountHolderName', 'iban'
    ];
    
    delivererFields.forEach(field => {
      const control = this.registerForm.get(field);
      if (control) {
        if (isDeliverer) {
          control.setValidators([Validators.required]);
        } else {
          control.clearValidators();
          control.setValue('');
        }
        control.updateValueAndValidity();
      }
    });
    
    // Log which sections are displayed
    console.log('Display sections:', {
      showRestaurantOwnerFields: this.showRestaurantOwnerFields,
      showDelivererFields: this.showDelivererFields
    });
  }

  get rolesFormArray(): FormArray {
    return this.registerForm.get('roles') as FormArray;
  }

  onRoleChange(role: UserRole, isChecked: boolean): void {
    const rolesArray = this.rolesFormArray;
    
    if (isChecked) {
      rolesArray.push(this.formBuilder.control(role));
    } else {
      const index = rolesArray.controls.findIndex(control => control.value === role);
      if (index !== -1) {
        rolesArray.removeAt(index);
      }
    }
    
    // Log current selected roles for debugging
    console.log('Selected roles:', rolesArray.value);
  }

  isRoleSelected(role: UserRole): boolean {
    const rolesArray = this.rolesFormArray;
    return rolesArray.controls.some(control => control.value === role);
  }

  onSubmit(): void {
    // Log the overall form validity and values for debugging
    console.log('Form status:', {
      valid: this.registerForm.valid,
      rolesSelected: this.rolesFormArray.length > 0,
      formValue: this.registerForm.value
    });
    
    if (this.registerForm.invalid || this.rolesFormArray.length === 0) {
      if (this.rolesFormArray.length === 0) {
        this.errorMessage = 'Please select at least one role';
      }
      
      // Log validation errors for debugging
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control && control.invalid) {
          console.log(`Invalid field '${key}':`, control.errors);
        }
      });
      
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const formValue = { ...this.registerForm.value };
    delete formValue.confirmPassword;
    
    // Remove unused fields based on selected roles
    if (!this.showRestaurantOwnerFields) {
      const restaurantFields = [
        'restaurantName', 'restaurantDescription', 'siretNumber', 'restaurantAddress', 
        'restaurantCity', 'restaurantZipCode', 'restaurantPhone', 'cuisineType', 'deliveryFee'
      ];
      restaurantFields.forEach(field => delete formValue[field]);
    }
    
    if (!this.showDelivererFields) {
      const delivererFields = [
        'delivererPhoneNumber', 'delivererSiretNumber', 'accountHolderName', 'iban'
      ];
      delivererFields.forEach(field => delete formValue[field]);
    }
    
    // Log the final data being sent to the server
    console.log('Submitting registration data:', formValue);
    
    this.authService.register(formValue)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          console.log('Registration request completed');
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error?.message || 'An error occurred during registration. Please try again.';
        }
      });
  }

  // Debug method to print form data
  debugForm(): void {
    console.group('🛠️ Form Debug Info');
    console.log('Form values:', this.registerForm.value);
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form touched:', this.registerForm.touched);
    console.log('Form dirty:', this.registerForm.dirty);
    
    console.group('Selected Roles');
    console.log('Roles array:', this.rolesFormArray.value);
    console.log('Is Restaurant Owner:', this.showRestaurantOwnerFields);
    console.log('Is Deliverer:', this.showDelivererFields);
    console.groupEnd();
    
    console.group('Validation Errors');
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control && control.invalid) {
        console.log(`Field '${key}':`, {
          errors: control.errors,
          value: control.value,
          touched: control.touched,
          dirty: control.dirty
        });
      }
    });
    console.groupEnd();
    
    console.groupEnd();
  }
} 