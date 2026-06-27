import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { AlertService } from '../../../core/services/alert.service';

type LoginRole = 'vendor' | 'organizer';

const DASHBOARD_HOME: Record<LoginRole, string> = {
  vendor: '/vendor/dash-board/home',
  organizer: '/organizer/dash-board/home',
};

@Component({
  selector: 'app-auth-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLogin {
  /** 表單標題，依登入角色由路由資料帶入。 */
  @Input() formTitle = '';

  /** 登入入口角色，用來決定登入成功後導向的 dashboard。 */
  @Input() role: LoginRole = 'vendor';

  /** 忘記密碼頁連結。 */
  @Input() forgotLink = '';

  /** 使用者輸入的 Email。 */
  email = '';

  /** 使用者輸入的密碼。 */
  password = '';

  /** 是否顯示密碼明文。 */
  showPassword = false;

  /** 防止重複送出登入。 */
  isSubmitting = false;

  /** 假資料帳號。 */
  private readonly fakeAccount = 'Market';
  /** 假資料密碼。 */
  private readonly fakePassword = 'AB123456789';

  constructor(
    private readonly alert: AlertService,
    private readonly router: Router) {}

  /** 切換密碼顯示狀態。 */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** 登入；目前使用假資料驗證，之後改為呼叫 API。 */
  async login(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const isLoginSuccess =
      this.email === this.fakeAccount &&
      this.password === this.fakePassword;

    if (!isLoginSuccess) {
      this.isSubmitting = false;

      await this.alert.error(
        '登入失敗',
        '帳號或密碼錯誤，請重新確認後再登入。',
        '重新輸入'
      );

      return;
    }

    //先用假資料
    sessionStorage.setItem('isLogin', 'true');
    sessionStorage.setItem('userRole', this.role);
    sessionStorage.setItem('account', this.email);

    this.isSubmitting = false;

    this.router.navigate([DASHBOARD_HOME[this.role]]);
  }
}
