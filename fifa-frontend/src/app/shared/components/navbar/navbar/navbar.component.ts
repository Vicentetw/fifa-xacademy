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
    // 👉 leo el usuario guardado
    this.user = this.authService.getUser();
  }

  // 🚪 logout
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}