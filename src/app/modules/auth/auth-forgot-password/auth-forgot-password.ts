import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-auth-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-forgot-password.html',
  styleUrl: './auth-forgot-password.scss',
})
export class AuthForgotPassword {
  @Input() formTitle = '';

  email = '';

  sendVerifyCode(): void {
    console.log('寄送重設密碼驗證碼：', this.email);
  }
}
