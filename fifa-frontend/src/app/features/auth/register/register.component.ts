import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
errorMessage = '';
successMessage = '';
isLoading = false;

form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});

constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router
) { }

register(): void {
  if (this.form.invalid) return;
  this.errorMessage = '';
  this.successMessage = '';

  this.isLoading = true;

  const email = this.form.get('email')?.value as string;
  const password = this.form.get('password')?.value as string;

  this.authService.register(email, password).subscribe({
    next: () => {
      this.isLoading = false;
      this.successMessage = 'Registration successful!';
      this.router.navigate(['/auth']);
    },
    error: (err: any) => {
      this.isLoading = false;
      this.errorMessage = err.error.message || 'Ocurrió un error durante el registro.';
    }
  });
}
}
