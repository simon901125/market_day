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
  const role = authService.getRoleFromUrl(router.url);
  const token = role ? authService.getToken(role) : null;
  const isBackendRequest = request.url.startsWith(environment.apiBaseUrl);

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
