import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../core/auth/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRole = route.data?.['role'];

  if (!authService.isPortalRole(requiredRole)) {
    return true;
  }

  if (authService.isLoggedIn(requiredRole)) {
    return true;
  }

  return router.createUrlTree([authService.getLoginPath(requiredRole)]);
};
