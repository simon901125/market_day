import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';

import {
  getAuthTokenKey,
  getAuthUserKey,
} from './auth-storage.constants';
import { ApiResult } from '../../models/interface/shared/ApiResult';
import {
  AuthPortalRole,
  EmailVerificationRequest,
  GoogleCredentialRequest,
  LoginRequest,
  LoginResponse,
  MarketDayRole,
  MarketDayUser,
  PasswordResetCodeRequest,
  PasswordResetVerificationResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '../../models/interface/shared/Auth';
import { HttpService } from '../http/http.service';

const DASHBOARD_HOME: Record<AuthPortalRole, string> = {
  vendor: '/vendor/dash-board/home',
  organizer: '/organizer/dash-board/home',
  admin: '/admin/dash-board/home',
};

const LOGIN_PATH: Record<AuthPortalRole, string> = {
  vendor: '/vendor/login',
  organizer: '/organizer/login',
  admin: '/admin/login',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  register(
    role: Exclude<AuthPortalRole, 'admin'>,
    payload: RegisterRequest
  ): Observable<ApiResult<null>> {
    return this.httpService.post<null>(
      `api/${role}/local-register`,
      payload
    );
  }

  googleRegister(
    role: Exclude<AuthPortalRole, 'admin'>,
    payload: GoogleCredentialRequest
  ): Observable<ApiResult<null>> {
    return this.httpService.post<null>(
      `api/${role}/google-register`,
      payload
    );
  }

  verifyRegistrationEmail(
    payload: EmailVerificationRequest
  ): Observable<ApiResult<null>> {
    return this.httpService.post<null>(
      'api/auth/createAccount/emailVerify',
      payload
    );
  }

  login(
    role: AuthPortalRole,
    payload: LoginRequest
  ): Observable<ApiResult<LoginResponse>> {
    return this.httpService.post<LoginResponse>(
      `api/${role}/local-login`,
      payload
    );
  }

  googleLogin(
    role: Exclude<AuthPortalRole, 'admin'>,
    payload: GoogleCredentialRequest
  ): Observable<ApiResult<LoginResponse>> {
    return this.httpService.post<LoginResponse>(
      `api/${role}/google-login`,
      payload
    );
  }

  requestPasswordReset(
    payload: PasswordResetCodeRequest
  ): Observable<ApiResult<null>> {
    return this.httpService.post<null>(
      'api/auth/resetPassword/request',
      payload
    );
  }

  verifyPasswordResetEmail(
    payload: EmailVerificationRequest
  ): Observable<ApiResult<PasswordResetVerificationResponse>> {
    return this.httpService.post<PasswordResetVerificationResponse>(
      'api/auth/resetPassword/emailVerify',
      payload
    );
  }

  resetPassword(
    payload: ResetPasswordRequest
  ): Observable<ApiResult<null>> {
    return this.httpService.post<null>(
      'api/auth/resetPassword/reset',
      payload
    );
  }

  logout(role: AuthPortalRole): Observable<ApiResult<null>> {
    return this.httpService
      .post<null>('api/auth/logout', {})
      .pipe(finalize(() => this.clearSession(role)));
  }

  saveSession(
    role: AuthPortalRole,
    token: string,
    user: MarketDayUser
  ): void {
    localStorage.setItem(getAuthTokenKey(role), token);
    localStorage.setItem(getAuthUserKey(role), JSON.stringify(user));
  }

  getToken(role: AuthPortalRole): string | null {
    return localStorage.getItem(getAuthTokenKey(role));
  }

  /**
   * 取得使用者
   * @param role 使用者角色
   * @returns user json
   */
  getUser(role: AuthPortalRole): MarketDayUser | null {
    const userKey = getAuthUserKey(role);
    const value = localStorage.getItem(userKey);
    if (!value) {
      return null;
    }

    try {
      const user = JSON.parse(value) as MarketDayUser;
      if (this.getPortalRole(user.role) !== role) {
        localStorage.removeItem(userKey);
        return null;
      }
      return user;
    } catch {
      localStorage.removeItem(userKey);
      return null;
    }
  }

  clearSession(role: AuthPortalRole): void {
    localStorage.removeItem(getAuthTokenKey(role));
    localStorage.removeItem(getAuthUserKey(role));

    // 清除舊版登入資料，避免舊狀態影響角色判斷。
    sessionStorage.removeItem('isLogin');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('account');
  }

  isLoggedIn(role: AuthPortalRole): boolean {
    return Boolean(this.getToken(role) && this.getUser(role));
  }

  getPortalRole(role?: MarketDayRole): AuthPortalRole | null {
    if (!role) {
      return null;
    }

    const normalizedRole = role.toLowerCase();
    return this.isPortalRole(normalizedRole) ? normalizedRole : null;
  }

  getDashboardPath(role: AuthPortalRole): string {
    return DASHBOARD_HOME[role];
  }

  getLoginPath(role: AuthPortalRole): string {
    return LOGIN_PATH[role];
  }

  isPortalRole(role: unknown): role is AuthPortalRole {
    return role === 'vendor' || role === 'organizer' || role === 'admin';
  }

  getRoleFromUrl(url: string): AuthPortalRole | null {
    const role = url.split('?')[0].split('/').filter(Boolean)[0];
    return this.isPortalRole(role) ? role : null;
  }
}
