import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return `${fieldName === 'email' ? 'Email' : 'Contraseña'} requerido`;
    if (field.errors['email']) return 'Email inválido';
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    return 'Campo inválido';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.form.invalid) return;

    this.errorMessage = '';
    this.isLoading = true;

    const { email, password } = this.form.value;

    this.authService.login(email!, password!).subscribe({

      next: () => {

        // después del login, pido el usuario
        this.authService.getMe().subscribe({

          next: (res: any) => {

            // guardo usuario en memoria
            this.authService.setUser(res.user);

            // recién ahora navego
            this.router.navigate(['/players']);
          },

          error: () => {
            this.errorMessage = 'No se pudo obtener usuario';
            this.isLoading = false;
          }

        });

      },

      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Error en login';
        this.isLoading = false;
      }

    });
  }
}