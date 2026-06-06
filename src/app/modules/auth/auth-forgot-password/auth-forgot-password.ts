import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-auth-forgot-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-forgot-password.html',
  styleUrl: './auth-forgot-password.scss',
})
export class AuthForgotPassword {
  /** 身分驗證：表單標題 */
  @Input() formTitle = '';
  /** 身分驗證：忘記密碼導至email驗證 */
  @Input() vertifyLink = '';
  /** 電子郵件 */
  email = '';

  /** 寄驗證碼 */
  sendVerifyCode(): void {
    console.log('寄送重設密碼驗證碼：', this.email);
  }
}
