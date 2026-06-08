import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-auth-verify-email',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-verify-email.html',
  styleUrl: './auth-verify-email.scss',
})
export class AuthVerifyEmail {
  /** 身分驗證：表單標題 */
  @Input() formTitle = '';
  /** 身分驗證：重設密碼 註冊路由 */
  @Input() backLink = '';
  /** 身分驗證：重設密碼 登入路由 */
  @Input() loginLink = '';
  /** 呼叫email驗證成功彈跳窗 */
  @Output() verifySuccess = new EventEmitter<void>();
  /** 呼叫email驗證失敗彈跳窗 */
  @Output() verifyError = new EventEmitter<void>();
  /** 電子信箱 */
  email = 'vendor@example.com';
  /** 驗證碼 */
  code = ['', '', '', '', '', ''];
  /** 是否顯示成功視窗 */
  showSuccessModal = false;
  /**是否顯示失敗視窗 */
  showErrorModal = false;

  /** 檢查驗證碼 */
  verifyCode(): void {
    const fullCode = this.code.join('');

    if (fullCode === '123456') {
      this.verifySuccess.emit();
    } else {
      this.verifyError.emit();
    }
  }

  /** 關閉訊息視窗 */
  closeModal(): void {
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }
  /** 重寄驗證碼 */
  resendCode(): void {
    console.log('重新寄送驗證碼');
  }
}
