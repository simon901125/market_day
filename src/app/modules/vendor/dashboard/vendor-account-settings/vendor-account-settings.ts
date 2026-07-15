import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { GoogleAuthService } from '../../../../core/services/google-auth.service';
import {
  AuthPortalRole,
  MarketDayUser,
} from '../../../../models/interface/shared/Auth';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { DashboradAccountSetting } from '../../../shared/dashboard/dashborad-account-setting/dashborad-account-setting';

@Component({
  selector: 'app-vendor-account-settings',
  imports: [DashboradAccountSetting],
  templateUrl: './vendor-account-settings.html',
})
export class VendorAccountSettings {
  @Input() navigateOnClose = true;
  @Output() closed = new EventEmitter<void>();

  role: AuthPortalRole = 'vendor';
  googleBinding = false;

  account = {
    email: '',
    name: '使用者',
    googleBound: false,
  };

  readonly passwordRule = '至少 8 碼，並建議包含英文與數字。';
  readonly cancellationWarning = '帳號註銷後將無法復原，請確認沒有進行中的報名、付款或活動。';

  constructor(
    private router: Router,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private alert: AlertService
  ) {
    this.loadUserInfo();
    void this.loadCurrentUser();
  }

  close(): void {
    this.closed.emit();

    if (this.navigateOnClose) {
      this.router.navigate(['/vendor/dash-board/home']);
    }
  }

  async bindGoogle(): Promise<void> {
    if (this.account.googleBound || this.googleBinding) {
      return;
    }

    this.googleBinding = true;

    try {
      const credential = await this.googleAuthService.getCredential();
      const response = await firstValueFrom(
        this.authService.bindGoogle({ credential })
      );

      if (!isApiSuccessStatus(response.statusCode)) {
        await this.alert.error(
          'Google 帳號綁定失敗',
          this.getGoogleBindApiMessage(response.message)
        );
        return;
      }

      await this.loadCurrentUser();
      await this.alert.success(
        'Google 帳號綁定成功',
        '之後可以使用 Google 帳號快速登入。'
      );
    } catch (error: unknown) {
      await this.alert.error(
        'Google 帳號綁定失敗',
        this.getGoogleBindErrorMessage(error)
      );
    } finally {
      this.googleBinding = false;
    }
  }

  private loadUserInfo(): void {
    const userInfo = this.authService.getUser(this.role);

    if (!userInfo) {
      return;
    }

    this.applyUserInfo(userInfo);
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.authService.getAuthMe({ skipLoading: true })
      );
      const user = response.data?.user;

      if (!isApiSuccessStatus(response.statusCode) || !user) {
        return;
      }

      this.authService.saveUser(this.role, user);
      this.applyUserInfo(user);
    } catch {
      // The auth interceptor handles expired sessions. Keep local data as fallback here.
    }
  }

  private applyUserInfo(userInfo: MarketDayUser): void {
    this.account.name = userInfo.name?.trim() || '使用者';
    this.account.email = userInfo.email || '';
    this.account.googleBound = this.isGoogleBound(userInfo);
  }

  private isGoogleBound(userInfo: MarketDayUser): boolean {
    const provider = userInfo.provider?.toUpperCase();
    return provider === 'GOOGLE' || provider === 'BOTH' || Boolean(userInfo.googleSub);
  }

  private getGoogleBindErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return this.getGoogleBindApiMessage(error.error?.message);
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Google 帳號綁定時發生錯誤，請稍後再試。';
  }

  private getGoogleBindApiMessage(message?: string): string {
    switch (message) {
      case 'Google account is already bound':
        return '此帳號已經綁定 Google。';
      case 'Google email does not match current account':
        return 'Google Email 必須與目前登入帳號相同。';
      case 'Invalid Google credential':
        return 'Google 憑證無效，請重新操作。';
      case 'Google credential is required':
        return '缺少 Google 憑證，請重新操作。';
      case 'Account is not active':
        return '帳號狀態未啟用，無法綁定 Google。';
      default:
        return message || 'Google 帳號綁定失敗，請稍後再試。';
    }
  }
}
