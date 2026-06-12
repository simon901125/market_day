import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  /** 密碼長度是否達到至少 8 個字元 */
  hasPwLenght = false;

  /** 密碼是否包含英文字母與數字 */
  hasPwNumLetter = false;

  /** 兩次輸入的密碼是否不一致 */
  passwordNotMatch = false;

  /** 切換密碼顯示狀態 */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** 切換確認密碼顯示狀態 */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /** 檢查密碼規則 */
  checkPwRole(): void {
    this.hasPwLenght = this.password.length >= 8;
    this.hasPwNumLetter =
      /[A-Za-z]/.test(this.password) && /\d/.test(this.password);

    this.checkPasswordMatch();
  }

  /** 檢查確認密碼是否與密碼一致 */
  checkPasswordMatch(): void {
    this.passwordNotMatch =
      this.checkPw.length > 0 && this.password !== this.checkPw;
  }
}