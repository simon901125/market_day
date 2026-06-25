import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-auth-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.scss',
})
export class AuthRegister {
  /** 表單標題，依登入角色由路由資料帶入。 */
  @Input() formTitle = '';

  /** Email 驗證頁連結。 */
  @Input() vertifyLink = '';

  /** 負責人姓名。 */
  directorName = '';

  /** 使用者 Email。 */
  email = '';

  /** 密碼。 */
  password = '';

  /** 確認密碼。 */
  checkPw = '';

  /** 是否顯示密碼明文。 */
  showPassword = false;

  /** 是否顯示確認密碼明文。 */
  showConfirmPassword = false;

  /** 密碼長度是否符合規則。 */
  hasPwLenght = false;

  /** 密碼是否包含英文字母與數字。 */
  hasPwNumLetter = false;

  /** 兩次密碼是否不一致。 */
  passwordNotMatch = false;

  constructor(
    private readonly alert: AlertService,
    private readonly router: Router
  ) {}

  /** 切換密碼顯示狀態。 */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** 切換確認密碼顯示狀態。 */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /** 檢查密碼規則。 */
  checkPwRole(): void {
    this.hasPwLenght = this.password.length >= 8;
    this.hasPwNumLetter =
      /[A-Za-z]/.test(this.password) && /\d/.test(this.password);

    this.checkPasswordMatch();
  }

  /** 檢查兩次輸入的密碼是否一致。 */
  checkPasswordMatch(): void {
    this.passwordNotMatch =
      this.checkPw.length > 0 && this.password !== this.checkPw;
  }

  /** 註冊送出；目前先保留假流程，之後改為呼叫 API。 */
  async register(): Promise<void> {
    this.checkPwRole();
    this.checkPasswordMatch();

    const isInvalid =
      !this.directorName ||
      !this.email ||
      !this.password ||
      !this.checkPw ||
      !this.hasPwLenght ||
      !this.hasPwNumLetter ||
      this.passwordNotMatch;

    if (isInvalid) {
      await this.alert.error(
        '註冊資料未完成',
        '請確認姓名、Email 與密碼皆已正確填寫。',
        '重新確認'
      );
      return;
    }

    // TODO: 串接註冊 API 後，成功再寄送 Email 驗證碼。
    await this.alert.success(
      '驗證碼已寄出',
      `我們已將 6 位數驗證碼寄送至<br>${this.email}。`,
      '前往驗證'
    );
    this.router.navigateByUrl(this.vertifyLink || '/vendor/verify-email');
  }
}
