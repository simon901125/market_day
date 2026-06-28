import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { getPasswordResetEmailKey } from '../../../core/auth/auth-storage.constants';
import { AlertService } from '../../../core/services/alert.service';

type ForgotPasswordRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-forgot-password.html',
  styleUrl: './auth-forgot-password.scss',
})
export class AuthForgotPassword {
  @Input() formTitle = '';
  @Input() vertifyLink = '';
  @Input() role: ForgotPasswordRole = 'vendor';

  email = '';
  isSubmitting = false;

  constructor(
    private readonly alert: AlertService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async sendVerifyCode(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    const email = this.email.trim();
    if (!email) {
      await this.alert.error('寄送失敗', '請先輸入 Email。', '重新輸入');
      return;
    }

    this.isSubmitting = true;

    try {
      const response = await firstValueFrom(
        this.authService.requestPasswordReset({ email })
      );

      if (response.statusCode !== 200) {
        await this.alert.error(
          '寄送失敗',
          this.getApiMessage(response.message),
          '重新輸入'
        );
        return;
      }

      sessionStorage.setItem(getPasswordResetEmailKey(this.role), email);
      await this.alert.success(
        '驗證碼已寄出',
        `若此 Email 為一般帳號，系統已將 6 位數驗證碼寄送至<br>${email}。`,
        '前往驗證'
      );
      await this.router.navigate(
        [this.vertifyLink || `/${this.role}/verify-email`],
        { queryParams: { email, purpose: 'reset' } }
      );
    } catch (error: unknown) {
      await this.alert.error(
        '寄送失敗',
        this.getErrorMessage(error),
        '重新輸入'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  private getApiMessage(message: string): string {
    if (message === 'Invalid email format') {
      return 'Email 格式不正確，請重新確認。';
    }

    return message || '驗證碼寄送失敗，請稍後再試。';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      return message?.includes('Invalid email format')
        ? 'Email 格式不正確，請重新確認。'
        : message || '無法連線至伺服器，請確認後端已啟動。';
    }

    return '驗證碼寄送失敗，請稍後再試。';
  }
}
