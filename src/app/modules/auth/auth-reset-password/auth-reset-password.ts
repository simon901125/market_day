import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-auth-reset-password',
  imports: [CommonModule, FormsModule, RouterLink],
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
      this.newPassword === this.confirmPassword
    ) {
      // 驗證成功後
      this.resetSuccess.emit();
    }
  }
}
