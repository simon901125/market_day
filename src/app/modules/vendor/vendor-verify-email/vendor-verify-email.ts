import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorSidebar } from '../../auth/vendor-sidebar/vendor-sidebar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor-verify-email',
  imports: [CommonModule, VendorSidebar, FormsModule, RouterLink],
  templateUrl: './vendor-verify-email.html',
  styleUrl: './vendor-verify-email.scss',
})
export class VendorVerifyEmail {

  //先給假的
  /** 電子郵件 */
  email = 'vendor@example.com';
  /** 驗證碼 */
  code = ['', '', '', '', '', ''];

  /** 顯示成功model框 */
  showSuccessModal = false;
  /** 顯示錯誤model框 */
  showErrorModal = false;

  /** 驗證驗證碼 */
  verifyCode() {
    const fullCode = this.code.join('');

    if (fullCode === '123456') {
      this.showSuccessModal = true;
    } else {
      this.showErrorModal = true;
    }
  }

  /** 關閉model框 */
  closeModal() {
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }

  /** 重新寄送驗證碼 */
  resendCode() {
    console.log('重新寄送驗證碼');
  }
}
