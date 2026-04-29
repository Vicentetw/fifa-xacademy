import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  // 👉 usuario actual
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

 ngOnInit() {

  // primero intento leer de memoria
  this.user = this.authService.getUser();

  // si no hay usuario, lo pido al backend
  if (!this.user) {
    this.authService.getMe().subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.authService.setUser(res.user);
      }
    });
  }
}

  // 🚪 logout
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}