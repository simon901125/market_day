import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-auth-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.scss',
})
export class AuthRegister {
  /** 表單標題 */
  @Input() formTitle = '';
  /** 負責人姓名 */
  directorName = '';
  /** 電子信箱 */
  email = '';
  /** 密碼 */
  password = '';
  /** 確認密碼 */
  checkPw = '';
  /** 是否顯示密碼 */
  showPassword = false;
  /** 是否顯示確認密碼 */
  showConfirmPassword = false;
  /** 密碼長度是否足夠 */
  hasPwLenght = false;
  /** 密碼長度是否足夠 */
  hasPwNumLetter = false;

  /** 顯示密碼 */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** 顯示確認密碼 */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /** 確認密碼規則 */
  checkPwRole(): void {
    this.hasPwLenght = this.password.length >= 8;
    this.hasPwNumLetter = /[A-Za-z]/.test(this.password) && /\d/.test(this.password);
  }
}
