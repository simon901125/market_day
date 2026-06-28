import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import {
  getPasswordResetEmailKey,
  getPasswordResetTokenKey,
} from '../../../core/auth/auth-storage.constants';
import { AlertService } from '../../../core/services/alert.service';

type ResetPasswordRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-reset-password.html',
  styleUrl: './auth-reset-password.scss',
})
export class AuthResetPassword implements OnInit {
  @Input() formTitle = '';
  @Input() loginLink = '';
  @Input() role: ResetPasswordRole = 'vendor';

  newPassword = '';
  confirmPassword = '';
  showNewPassword = false;
  showConfirmPassword = false;
  hasPwLenght = false;
  hasPwNumLetter = false;
  passwordNotMatch = false;
  isSubmitting = false;

  private resetToken = '';

  constructor(
    private readonly alert: AlertService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.resetToken =
      sessionStorage.getItem(getPasswordResetTokenKey(this.role)) || '';
  }

  get isPasswordLengthValid(): boolean {
    return this.newPassword.length >= 8;
  }

  get isPasswordFormatValid(): boolean {
    return /[A-Za-z]/.test(this.newPassword) && /\d/.test(this.newPassword);
  }

  checkPwRole(): void {
    this.hasPwLenght = this.isPasswordLengthValid;
    this.hasPwNumLetter = this.isPasswordFormatValid;
    this.checkPasswordMatch();
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async resetPassword(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.checkPwRole();
    this.checkPasswordMatch();

    const isInvalid =
      !this.newPassword ||
      !this.confirmPassword ||
      !this.isPasswordLengthValid ||
      !this.isPasswordFormatValid ||
      this.passwordNotMatch;

    if (isInvalid) {
      await this.alert.error(
        '密碼重設失敗',
        '密碼至少需要 8 個字元，並同時包含英文字母與數字，且兩次輸入必須一致。',
        '重新確認'
      );
      return;
    }

    if (!this.resetToken) {
      await this.alert.error(
        '重設連結已失效',
        '找不到密碼重設憑證，請重新執行忘記密碼流程。',
        '重新驗證'
      );
      await this.router.navigateByUrl(`/${this.role}/forgot-password`);
      return;
    }

    this.isSubmitting = true;

    try {
      const response = await firstValueFrom(
        this.authService.resetPassword({
          resetToken: this.resetToken,
          password: this.newPassword,
        })
      );

      if (
        response.statusCode !== 200 ||
        response.message !== 'Password reset successfully'
      ) {
        await this.alert.error(
          '密碼重設失敗',
          this.getApiMessage(response.message),
          '重新確認'
        );
        return;
      }

      this.clearResetSession();
      await this.alert.success(
        '密碼重設成功',
        '密碼已更新完成，現在可以使用新密碼登入。',
        '前往登入'
      );
      await this.router.navigateByUrl(
        this.loginLink || `/${this.role}/login`
      );
    } catch (error: unknown) {
      await this.alert.error(
        '密碼重設失敗',
        this.getErrorMessage(error),
        '重新確認'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  checkPasswordMatch(): void {
    this.passwordNotMatch =
      this.confirmPassword.length > 0 &&
      this.newPassword !== this.confirmPassword;
  }

  private clearResetSession(): void {
    sessionStorage.removeItem(getPasswordResetEmailKey(this.role));
    sessionStorage.removeItem(getPasswordResetTokenKey(this.role));
  }

  private getApiMessage(message: string): string {
    if (message === 'Invalid or expired reset token') {
      return '密碼重設憑證錯誤或已逾期，請重新執行忘記密碼流程。';
    }
    if (message.includes('Password must be at least 8 characters')) {
      return '密碼至少需要 8 個字元，並同時包含英文字母與數字。';
    }

    return message || '密碼重設失敗，請稍後再試。';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return this.getApiMessage(
        error.error?.message || '無法連線至伺服器，請確認後端已啟動。'
      );
    }

    return '密碼重設失敗，請稍後再試。';
  }
}
