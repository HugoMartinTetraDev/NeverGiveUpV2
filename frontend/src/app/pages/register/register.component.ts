import { Component, OnInit, isDevMode } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
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
  
  /**
   * Formate le message d'erreur pour l'affichage HTML
   */
  formatErrorMessage(message: string): string {
    if (!message) return '';
    
    // Remplacer les sauts de ligne par des balises <br>
    return message.replace(/\n/g, '<br>');
  }
  
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
      address: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
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
      iban: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/)]],
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
    const isRestaurantOwner = roles.includes(UserRole.RESTAURATEUR);
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
    const isDeliverer = roles.includes(UserRole.LIVREUR);
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

  /**
   * Gère le clic sur le bouton d'inscription
   */
  onButtonClick(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    this.markFormGroupTouched(this.registerForm);
    
    // Vérifier si le formulaire est valide
    if (this.registerForm.valid && this.rolesFormArray.length > 0) {
      // Si le formulaire est valide, on soumet le formulaire
      this.onSubmit();
    } else {
      // Sinon, on affiche un message d'erreur
      if (this.rolesFormArray.length === 0) {
        this.errorMessage = 'Veuillez sélectionner au moins un type de compte';
      } else {
        this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire avant de continuer';
      }
      
      // Debug des erreurs
      this.debugForm();
    }
  }

  /**
   * Soumission du formulaire d'inscription
   */
  onSubmit(): void {
    if (this.registerForm.invalid || this.rolesFormArray.length === 0) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Récupérer les valeurs du formulaire
    const formValues = this.registerForm.value;

    // Préparer les données pour l'API
    const userData: any = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      birthDate: new Date(formValues.birthDate),
      address: formValues.address,
      phoneNumber: formValues.phoneNumber || undefined,
      roles: this.rolesFormArray.value,
    };

    // Ajouter les informations spécifiques au restaurateur si nécessaire
    if (this.showRestaurantOwnerFields) {
      userData.siret = formValues.siretNumber;
    }

    // Ajouter les informations spécifiques au livreur si nécessaire
    if (this.showDelivererFields) {
      userData.iban = formValues.iban;
    }

    // Log des données envoyées à l'API
    console.log('Données envoyées à l\'API:', userData);

    // Appeler le service d'authentification pour créer l'utilisateur
    this.authService.register(userData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          // Rediriger vers la page d'accueil
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
          
          // Formatter le message d'erreur
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
          }
          
          // Si c'est une erreur de validation, afficher les détails
          if (error.error?.errors) {
            const errorDetails = error.error.errors.map((err: any) => `${err.field}: ${err.message}`).join('\n');
            this.errorMessage += '\n' + errorDetails;
          }
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

  /**
   * Marque tous les contrôles d'un FormGroup comme touchés
   */
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 