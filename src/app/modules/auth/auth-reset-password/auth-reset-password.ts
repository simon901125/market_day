import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Alert } from '../../shared/alert';

@Component({
  selector: 'app-auth-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-reset-password.html',
  styleUrl: './auth-reset-password.scss',
})
export class AuthResetPassword {
  /** 表單標題，依登入角色由路由資料帶入。 */
  @Input() formTitle = '';

  /** 登入頁連結。 */
  @Input() loginLink = '';

  /** 新密碼。 */
  newPassword = '';

  /** 確認新密碼。 */
  confirmPassword = '';

  /** 是否顯示新密碼明文。 */
  showNewPassword = false;

  /** 是否顯示確認密碼明文。 */
  showConfirmPassword = false;

  /** 密碼長度是否符合規則。 */
  hasPwLenght = false;

  /** 密碼是否包含英文字母與數字。 */
  hasPwNumLetter = false;

  /** 兩次密碼是否不一致。 */
  passwordNotMatch = false;

  constructor(
    private readonly alert: Alert,
    private readonly router: Router
  ) {}

  /** 密碼長度是否有效。 */
  get isPasswordLengthValid(): boolean {
    return this.newPassword.length >= 8;
  }

  /** 密碼格式是否有效。 */
  get isPasswordFormatValid(): boolean {
    return /[A-Za-z]/.test(this.newPassword) && /\d/.test(this.newPassword);
  }

  /** 檢查密碼規則。 */
  checkPwRole(): void {
    this.hasPwLenght = this.isPasswordLengthValid;
    this.hasPwNumLetter = this.isPasswordFormatValid;
    this.checkPasswordMatch();
  }

  /** 切換新密碼顯示狀態。 */
  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  /** 切換確認密碼顯示狀態。 */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /** 送出重設密碼；目前先保留假流程，之後改為呼叫 API。 */
  async resetPassword(): Promise<void> {
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
        '請確認密碼符合規則，且兩次輸入的密碼一致。',
        '重新確認'
      );
      return;
    }

    // TODO: 串接重設密碼 API 後，成功再顯示提示。
    await this.alert.success(
      '密碼重設成功',
      '你的密碼已更新完成，<br>現在可以返回登入並使用新密碼登入。',
      '前往登入'
    );
    this.router.navigateByUrl(this.loginLink || '/vendor/login');
  }

  /** 檢查兩次輸入的密碼是否一致。 */
  checkPasswordMatch(): void {
    this.passwordNotMatch =
      this.confirmPassword.length > 0 && this.newPassword !== this.confirmPassword;
  }
}
