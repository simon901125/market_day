import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

type AuthRole = 'vendor' | 'organizer' | 'admin';

const LOGIN_PATH: Record<AuthRole, string> = {
  vendor: '/vendor/login',
  organizer: '/organizer/login',
  admin: '/admin/login',
};

const DASHBOARD_HOME: Record<AuthRole, string> = {
  vendor: '/vendor/dash-board/home',
  organizer: '/organizer/dash-board/home',
  admin: '/admin/dash-board/home',
};

function isAuthRole(role: unknown): role is AuthRole {
  return role === 'vendor' || role === 'organizer' || role === 'admin';
}

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const isLogin = sessionStorage.getItem('isLogin') === 'true';
  const requiredRole = route.data?.['role'];
  const currentRole = sessionStorage.getItem('userRole');

  if (!isLogin) {
    const loginPath = isAuthRole(requiredRole) ? LOGIN_PATH[requiredRole] : '/vendor/login';
    return router.createUrlTree([loginPath]);
  }

  if (!isAuthRole(requiredRole)) {
    return true;
  }

  if (currentRole === requiredRole) {
    return true;
  }

  return router.createUrlTree([
    isAuthRole(currentRole) ? DASHBOARD_HOME[currentRole] : LOGIN_PATH[requiredRole],
  ]);
};
