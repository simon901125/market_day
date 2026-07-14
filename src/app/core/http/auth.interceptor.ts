import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role =
    authService.getRoleFromUrl(router.url) ??
    authService.getRoleFromUrl(globalThis.location?.pathname ?? '');
  const token = role ? authService.getToken(role) : null;
  const isBackendRequest = request.url.startsWith(environment.apiBaseUrl);

  if (role && token && isBackendRequest && authService.isTokenExpired(token)) {
    authService.clearSession(role);
    void router.navigateByUrl(authService.getLoginPath(role));

    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          url: request.url,
          error: { message: 'Session expired' },
        })
    );
  }

  const authorizedRequest =
    token && isBackendRequest
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : request;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (role) {
          authService.clearSession(role);
          void router.navigateByUrl(authService.getLoginPath(role));
        }
      }

      return throwError(() => error);
    })
  );
};
