import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorSidebar } from '../vendor-sidebar/vendor-sidebar';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-vendor-reset-password',
  imports: [CommonModule, VendorSidebar, FormsModule, RouterLink],
  templateUrl: './vendor-reset-password.html',
  styleUrl: './vendor-reset-password.scss',
})
export class VendorResetPassword {
  /** 新密碼 */
  newPassword = '';
  /** 確認新密碼 */
  confirmPassword = '';
  /** 是否顯示新密碼 */
  showNewPassword = false;
  /** 是否顯示確認新密碼 */
  showConfirmPassword = false;

  //是不是也要有顯示失敗的modal?
  /** 顯示成功模態框 */ 
  showSuccessModal = false;

  /** 檢查密碼長度是否有效 */
  get isPasswordLengthValid(): boolean {
    return this.newPassword.length >= 8;
  }

  /** 檢查密碼格式是否有效 */
  get isPasswordFormatValid(): boolean {
    return /[A-Za-z]/.test(this.newPassword) && /\d/.test(this.newPassword);
  }
  /** 切換新密碼顯示狀態 */
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  /** 切換確認新密碼顯示狀態 */
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /** 重置密碼 */
  resetPassword() {
    if (
      this.isPasswordLengthValid &&
      this.isPasswordFormatValid &&
      this.newPassword === this.confirmPassword
    ) {
      this.showSuccessModal = true;
    }
  }
}
