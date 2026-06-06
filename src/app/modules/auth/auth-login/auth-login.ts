import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-auth-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLogin {
  /** 身分驗證：表單標題 */
  @Input() formTitle = '';
  /** 身分驗證：忘記密碼路由 */
  @Input() forgotLink = '';
  /** 電子郵件 */
  email = '';
  /** 密碼 */
  password = '';
  /** 顯示密碼 */
  showPassword = false;

  /** 顯示密碼 */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
