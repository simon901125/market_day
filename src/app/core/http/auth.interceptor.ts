import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

const PUBLIC_AUTH_ENDPOINTS = [
  /\/api\/(?:vendor|organizer|admin)\/local-login(?:[/?#]|$)/,
  /\/api\/(?:vendor|organizer)\/(?:local-register|google-login|google-register)(?:[/?#]|$)/,
  /\/api\/auth\/createAccount\/(?:emailVerify|resend)(?:[/?#]|$)/,
  /\/api\/auth\/resetPassword\/(?:request|emailVerify|reset)(?:[/?#]|$)/,
];

function isPublicAuthEndpoint(url: string): boolean {
  return PUBLIC_AUTH_ENDPOINTS.some((pattern) => pattern.test(url));
}

function isLoggedInPasswordChange(request: HttpRequest<unknown>): boolean {
  if (!/\/api\/auth\/resetPassword\/reset(?:[/?#]|$)/.test(request.url)) {
    return false;
  }

  const body = request.body;
  return (
    typeof body === 'object' &&
    body !== null &&
    'currentPassword' in body
  );
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role =
    authService.getRoleFromUrl(router.url) ??
    authService.getRoleFromUrl(globalThis.location?.pathname ?? '');
  const token = role ? authService.getToken(role) : null;
  const isBackendRequest = request.url.startsWith(environment.apiBaseUrl);
  const isPublicAuthRequest =
    isBackendRequest &&
    isPublicAuthEndpoint(request.url) &&
    !isLoggedInPasswordChange(request);

  // 登入、註冊及密碼驗證流程不可攜帶舊 Token，避免過期 Token
  // 讓第一次登入在請求送達後端前就被攔截為 401。
  if (isPublicAuthRequest) {
    return next(request);
  }

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
