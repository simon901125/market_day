import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLogin = sessionStorage.getItem('isLogin') === 'true';
  if (isLogin) {
    return true;
  }
  return router.createUrlTree(['/vendor/login']);
};
