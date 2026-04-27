import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional (Angular moderno)
 * Agrega automáticamente cookies a todas las requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest);
};