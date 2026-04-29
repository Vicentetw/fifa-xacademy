import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'players',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  // 👇 PRIMERO la ruta con parámetro
  {
    path: 'players/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/players/player-detail/player-detail.component')
        .then(m => m.PlayerDetailComponent)
  },

  // 👇 DESPUÉS la general
  {
    path: 'players',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/players/player-list/player-list.component')
        .then(m => m.PlayerListComponent)
  }
];