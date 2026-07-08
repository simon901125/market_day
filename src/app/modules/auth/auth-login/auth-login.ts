import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { MarketDayUser } from '../../../models/interface/shared/Auth';
import { AlertService } from '../../../core/services/alert.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { isApiSuccessStatus } from '../../../models/interface/shared/ApiResult';

type LoginRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLogin {
  @Input() formTitle = '';
  @Input() role: LoginRole = 'vendor';
  @Input() forgotLink = '';

  email = '';
  password = '';
  showPassword = false;
  isSubmitting = false;
  isGoogleSubmitting = false;

  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private readonly alert: AlertService,
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async login(): Promise<void> {
    if (this.isSubmitting || this.isGoogleSubmitting) {
      return;
    }

    const email = this.email.trim();
    if (!email || !this.password) {
      await this.alert.error(
        '登入資料不完整',
        '請輸入 Email 與密碼。',
        '重新輸入'
      );
      return;
    }

    if (!this.isValidEmail(email)) {
      await this.alert.error(
        'Email 格式錯誤',
        '請輸入正確的 Email 格式。',
        '重新輸入'
      );
      return;
    }

    this.isSubmitting = true;

    this.authService
      .login(this.role, {
        email,
        password: this.password,
      })
      .subscribe({
        next: async (res) => {
          this.isSubmitting = false;

          if (!isApiSuccessStatus(res.statusCode) || !res.data?.token || !res.data.user) {
            await this.alert.error(
              '登入失敗',
              this.getLocalApiMessage(res.message),
              '重新輸入'
            );
            return;
          }

          await this.saveSessionAndGoDashboard(
            res.data.token,
            res.data.user
          );
        },
        error: async (error: unknown) => {
          this.isSubmitting = false;
          await this.alert.error(
            '登入失敗',
            this.getLocalErrorMessage(error),
            '重新輸入'
          );
        },
      });
  }

  async googleLogin(): Promise<void> {
    if (this.isSubmitting || this.isGoogleSubmitting) {
      return;
    }

    this.isGoogleSubmitting = true;

    try {
      const credential = await this.googleAuthService.getCredential();
      const response = await firstValueFrom(
        this.authService.googleLogin(this.role, { credential })
      );

      if (
        !isApiSuccessStatus(response.statusCode) ||
        !response.data?.token ||
        !response.data.user
      ) {
        await this.alert.error(
          'Google 登入失敗',
          this.getGoogleApiMessage(response.message),
          '重新操作'
        );
        return;
      }

      await this.saveSessionAndGoDashboard(
        response.data.token,
        response.data.user
      );
    } catch (error: unknown) {
      await this.alert.error(
        'Google 登入失敗',
        this.getGoogleErrorMessage(error),
        '重新操作'
      );
    } finally {
      this.isGoogleSubmitting = false;
    }
  }

  private async saveSessionAndGoDashboard(
    token: string,
    user: MarketDayUser
  ): Promise<void> {
    const loginRole = this.authService.getPortalRole(user.role);
    if (loginRole !== this.role) {
      await this.alert.error(
        '登入失敗',
        '此帳號不屬於目前的登入身分。',
        '重新確認'
      );
      return;
    }

    this.authService.saveSession(loginRole, token, user);
    await this.router.navigate([this.authService.getDashboardPath(loginRole)]);
  }

  private isValidEmail(email: string): boolean {
    return this.emailPattern.test(email);
  }

  private getLocalErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return this.getLocalApiMessage(error.error?.message);
    }

    return '登入時發生錯誤，請稍後再試。';
  }

  private getGoogleErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return this.getGoogleApiMessage(error.error?.message);
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Google 登入時發生錯誤，請稍後再試。';
  }

  private getLocalApiMessage(message?: string): string {
    switch (message) {
      case 'Invalid email or password':
        return 'Email 或密碼錯誤，請重新確認。';
      case 'Email is not verified':
        return '此帳號尚未完成 Email 驗證，請先完成驗證。';
      case 'Account is not active':
        return '此帳號目前無法使用，請聯絡系統管理員。';
      case 'This account cannot login from this portal':
        return '此帳號不能從目前入口登入，請確認登入身分。';
      default:
        return message || '帳號或密碼錯誤，請重新確認。';
    }
  }

  private getGoogleApiMessage(message?: string): string {
    switch (message) {
      case 'Google account is not registered':
        return '此 Google 帳號尚未註冊，請先完成註冊。';
      case 'Email is not verified':
        return '此 Google 帳號尚未完成 Email 驗證，請先完成驗證。';
      case 'Account is not active':
        return '此帳號目前無法使用，請聯絡系統管理員。';
      case 'This account cannot login from this portal':
        return '此 Google 帳號不能登入目前入口，請確認登入身分。';
      case 'Invalid Google credential':
        return 'Google 登入憑證無效，請重新操作。';
      case 'Google credential is required':
        return '缺少 Google 登入憑證，請重新操作。';
      default:
        return message || 'Google 登入失敗，請稍後再試。';
    }
  }
}
