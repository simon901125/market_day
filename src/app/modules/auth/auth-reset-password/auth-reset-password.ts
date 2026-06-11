import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alert } from '../../shared/alert';
@Component({
  selector: 'app-auth-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-reset-password.html',
  styleUrl: './auth-reset-password.scss',
})
export class AuthResetPassword {
  /** 表單標題 */
  @Input() formTitle = '';
  /** 登入路由 */
  @Input() loginLink = '';
  /** 呼叫重置密碼彈跳窗 */
  @Output() resetSuccess = new EventEmitter<void>();
  /** 新密碼 */
  newPassword = '';
  /** 確認新密碼 */
  confirmPassword = '';
  /** 是否顯示新密碼 */
  showNewPassword = false;
  /** 是否顯示確認新密碼 */
  showConfirmPassword = false;
  /** 密碼長度是否足夠 */
  hasPwLenght = false;
  /** 密碼長度是否足夠 */
  hasPwNumLetter = false;
  /** 密碼是否吻合 */
  passwordNotMatch = false;

  constructor(private alert: Alert) {}
  
  /** 檢查密碼長度是否有效 */
  get isPasswordLengthValid(): boolean {
    return this.newPassword.length >= 8;
  }
  /** 檢查密碼格式是否有效 */
  get isPasswordFormatValid(): boolean {
    return /[A-Za-z]/.test(this.newPassword) && /\d/.test(this.newPassword);
  }

  /** 確認密碼規則 */
  checkPwRole(): void {
    this.hasPwLenght = this.newPassword.length >= 8;
    this.hasPwNumLetter = /[A-Za-z]/.test(this.newPassword) && /\d/.test(this.newPassword);
  }

  /** 切換新密碼顯示狀態 */
  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }
  /** 切換確認新密碼顯示狀態 */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  /** 重置密碼 */
  resetPassword(): void {
    if (
      this.isPasswordLengthValid &&
      this.isPasswordFormatValid &&
      this.passwordNotMatch
    ) {
      // 驗證成功後
      this.resetSuccess.emit();
    }

    this.alert.success(
      '密碼重設成功',
      '你的密碼已更新完成，<br>現在可以返回登入並使用新密碼登入。',
      '前往登入'
    );
  }

  /** 檢查新密碼與確認密碼是否吻合 */
  checkPasswordMatch() {
    this.passwordNotMatch =
      this.confirmPassword.length > 0 && this.newPassword !== this.confirmPassword;
  }
}
