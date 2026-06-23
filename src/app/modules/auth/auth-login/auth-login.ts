import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Alert } from '../../shared/alert';

@Component({
  selector: 'app-auth-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLogin {
  /** 表單標題，依登入角色由路由資料帶入。 */
  @Input() formTitle = '';

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

  constructor(private readonly alert: Alert) {}

  /** 切換密碼顯示狀態。 */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** 登入；目前先保留假流程，之後改為呼叫 API。 */
  async login(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    // TODO: 串接登入 API 後，依 API 回傳結果判斷成功或失敗。
    const isLoginSuccess = false;

    if (!isLoginSuccess) {
      this.isSubmitting = false;
      await this.alert.error(
        '登入失敗',
        '帳號或密碼錯誤，請重新確認後再登入。',
        '重新輸入'
      );
      return;
    }

    this.isSubmitting = false;
  }
}
