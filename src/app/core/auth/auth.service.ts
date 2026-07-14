import { Injectable } from '@angular/core';
import { finalize, firstValueFrom, Observable } from 'rxjs';

import {
  getAuthTokenKey,
  getAuthUserKey,
} from './auth-storage.constants';
import {
  ApiResult,
  isApiSuccessStatus,
} from '../../models/interface/shared/ApiResult';
import {
  AuthPortalRole,
  ChangePasswordRequest,
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
  UserProfileResponse,
} from '../../models/interface/shared/Auth';
import { HttpRequestOptions, HttpService } from '../http/http.service';

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
  private readonly validatedSessions = new Set<AuthPortalRole>();
  private readonly validationRequests = new Map<AuthPortalRole, Promise<boolean>>();

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

  bindGoogle(
    payload: GoogleCredentialRequest
  ): Observable<ApiResult<null>> {
    return this.httpService.post<null>('api/auth/google-bind', payload);
  }

  getAuthMe(options: HttpRequestOptions = {}): Observable<ApiResult<UserProfileResponse>> {
    return this.httpService.get<UserProfileResponse>('api/auth/me', options);
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

  changePassword(
    payload: ChangePasswordRequest
  ): Observable<ApiResult<null>> {
    return this.httpService.post<null>(
      'api/auth/resetPassword/reset',
      payload
    );
  }

  deactivateAccount(): Observable<ApiResult<null>> {
    return this.httpService.post<null>('api/account/deactivate', {});
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
    this.validatedSessions.add(role);
  }

  saveUser(role: AuthPortalRole, user: MarketDayUser): void {
    localStorage.setItem(getAuthUserKey(role), JSON.stringify(user));
  }

  getToken(role: AuthPortalRole): string | null {
    return localStorage.getItem(getAuthTokenKey(role));
  }

  isTokenExpired(token: string): boolean {
    const expiresAt = this.getTokenExpiresAt(token);
    return expiresAt === null || Date.now() >= expiresAt;
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
    this.validatedSessions.delete(role);
    this.validationRequests.delete(role);

    // 清除舊版登入資料，避免舊狀態影響角色判斷。
    sessionStorage.removeItem('isLogin');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('account');
  }

  isLoggedIn(role: AuthPortalRole): boolean {
    const token = this.getToken(role);
    const user = this.getUser(role);

    if (!token || !user) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      this.clearSession(role);
      return false;
    }

    return true;
  }

  validateSession(role: AuthPortalRole): Promise<boolean> {
    if (!this.isLoggedIn(role)) {
      return Promise.resolve(false);
    }

    if (this.validatedSessions.has(role)) {
      return Promise.resolve(true);
    }

    const pendingRequest = this.validationRequests.get(role);
    if (pendingRequest) {
      return pendingRequest;
    }

    const validationRequest = this.validateStoredSession(role).finally(() => {
      this.validationRequests.delete(role);
    });
    this.validationRequests.set(role, validationRequest);
    return validationRequest;
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

  private async validateStoredSession(role: AuthPortalRole): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.getAuthMe({ skipLoading: true })
      );
      const user = response.data?.user;
      const isValid =
        isApiSuccessStatus(response.statusCode) &&
        !!user &&
        this.getPortalRole(user.role) === role;

      if (!isValid) {
        this.clearSession(role);
        return false;
      }

      this.saveUser(role, user);
      this.validatedSessions.add(role);
      return true;
    } catch {
      this.clearSession(role);
      return false;
    }
  }

  private getTokenExpiresAt(token: string): number | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payload = JSON.parse(this.decodeBase64Url(parts[1])) as { exp?: unknown };
      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private decodeBase64Url(value: string): string {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );
    return atob(paddedBase64);
  }
}
