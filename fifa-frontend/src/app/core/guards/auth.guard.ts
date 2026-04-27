import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getMe().pipe(
    // ✔ Si el backend responde OK → el usuario está autenticado
    map(() => true),

    // ❌ Si falla (no hay cookie válida, token expirado, etc.)
    catchError(() => {
      // 🔁 Redirige automáticamente al login
      return of(router.createUrlTree(['/auth']));
    })
  );
};