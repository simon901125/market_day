import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-auth-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-forgot-password.html',
  styleUrl: './auth-forgot-password.scss',
})
export class AuthForgotPassword {
  /** 表單標題，依登入角色由路由資料帶入。 */
  @Input() formTitle = '';

  /** Email 驗證頁連結。 */
  @Input() vertifyLink = '';

  /** 使用者輸入的 Email。 */
  email = '';

  constructor(
    private readonly alert: AlertService,
    private readonly router: Router
  ) {}

  /** 寄送重設密碼驗證碼；目前先保留假流程，之後改為呼叫 API。 */
  async sendVerifyCode(): Promise<void> {
    if (!this.email) {
      await this.alert.error('寄送失敗', '請先輸入 Email。', '重新輸入');
      return;
    }

    // TODO: 串接寄送驗證碼 API 後，成功再導向驗證頁。
    await this.alert.success(
      '驗證碼已寄出',
      `我們已將 6 位數驗證碼寄送至<br>${this.email}。`,
      '前往驗證'
    );
    this.router.navigateByUrl(this.vertifyLink || '/vendor/verify-email');
  }
}
