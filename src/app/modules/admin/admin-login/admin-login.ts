import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/auth/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  email = '';
  password = '';
  showPassword = false;
  isSubmitting = false;

  constructor(
    private readonly alert: AlertService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async loginAdmin(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    if (!this.email.trim() || !this.password) {
      await this.alert.error(
        '登入資料未完成',
        '請輸入 Email 與密碼。',
        '重新輸入'
      );
      return;
    }

    this.isSubmitting = true;
    this.authService
      .login('admin', {
        email: this.email.trim(),
        password: this.password,
      })
      .subscribe({
        next: async (res) => {
          this.isSubmitting = false;

          if (res.statusCode !== 200 || !res.data?.token || !res.data.user) {
            await this.alert.error(
              '登入失敗',
              res.message || '帳號或密碼錯誤，請重新確認後再登入。',
              '重新輸入'
            );
            return;
          }

          if (this.authService.getPortalRole(res.data.user.role) !== 'admin') {
            await this.alert.error(
              '登入失敗',
              '此帳號不是系統管理員帳號。',
              '重新確認'
            );
            return;
          }

          this.authService.saveSession(
            'admin',
            res.data.token,
            res.data.user
          );
          await this.router.navigate([
            this.authService.getDashboardPath('admin'),
          ]);
        },
        error: async (error: unknown) => {
          this.isSubmitting = false;
          await this.alert.error(
            '登入失敗',
            this.getErrorMessage(error),
            '重新輸入'
          );
        },
      });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || '目前無法連線至伺服器，請稍後再試。';
    }

    return '登入時發生錯誤，請稍後再試。';
  }
}
