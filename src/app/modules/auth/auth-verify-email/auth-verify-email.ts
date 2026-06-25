import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-auth-verify-email',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-verify-email.html',
  styleUrl: './auth-verify-email.scss',
})
export class AuthVerifyEmail implements OnInit, OnDestroy {
  /** 驗證碼輸入框清單，用來自動移動焦點。 */
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  /** 表單標題，依登入角色由路由資料帶入。 */
  @Input() formTitle = '';

  /** 返回註冊頁連結。 */
  @Input() backLink = '';

  /** 登入頁連結。 */
  @Input() loginLink = '';

  /** 顯示用 Email；之後串 API 時由後端或註冊流程帶入。 */
  email = 'vendor@example.com';

  /** 六位數驗證碼。 */
  code = ['', '', '', '', '', ''];

  /** 重新寄送倒數秒數。 */
  resendSeconds = 56;

  /** 倒數計時器。 */
  private resendTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly alert: AlertService,
    private readonly router: Router
  ) {}

  /** 啟動重新寄送倒數。 */
  ngOnInit(): void {
    this.startResendCountdown();
  }

  /** 離開元件時清除計時器。 */
  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  /** 限制驗證碼只能輸入數字，並在輸入後跳到下一格。 */
  onCodeInput(value: string, index: number): void {
    const onlyNumber = value.replace(/\D/g, '').slice(-1);
    this.code[index] = onlyNumber;

    if (onlyNumber && index < this.code.length - 1) {
      this.focusCodeInput(index + 1);
    }
  }

  /** 按退格時，若目前欄位為空，回到上一格。 */
  onCodeBackspace(index: number): void {
    if (!this.code[index] && index > 0) {
      this.focusCodeInput(index - 1);
    }
  }

  /** 驗證 Email 驗證碼；目前先用 123456 模擬成功。 */
  async verifyCode(): Promise<void> {
    const fullCode = this.code.join('');

    // TODO: 串接 Email 驗證 API 後，改用 API 回傳結果判斷。
    if (fullCode === '123456') {
      await this.alert.success(
        '驗證成功',
        '你的 Email 已完成驗證，<br>現在可以登入攤主平台。',
        '前往登入'
      );
      this.router.navigateByUrl(this.loginLink || '/vendor/login');
      return;
    }

    await this.alert.error(
      '驗證失敗',
      '你輸入的驗證碼不正確或已失效，<br>請重新確認後再試一次。',
      '重新輸入'
    );
    this.code = ['', '', '', '', '', ''];
    setTimeout(() => this.focusCodeInput(0));
  }

  /** 重新寄送驗證碼。 */
  async resendCode(): Promise<void> {
    if (this.resendSeconds > 0) {
      return;
    }

    // TODO: 串接重新寄送驗證碼 API。
    this.resendSeconds = 56;
    this.startResendCountdown();

    await this.alert.success(
      '驗證碼已重新寄出',
      `我們已將新的 6 位數驗證碼寄送至<br>${this.email}。`,
      '知道了'
    );
  }

  /** 聚焦指定的驗證碼輸入框。 */
  private focusCodeInput(index: number): void {
    const input = this.codeInputs.get(index)?.nativeElement;

    if (input) {
      input.focus();
      input.select();
    }
  }

  /** 開始重新寄送倒數。 */
  private startResendCountdown(): void {
    this.clearResendTimer();

    this.resendTimer = setInterval(() => {
      if (this.resendSeconds <= 0) {
        this.clearResendTimer();
        return;
      }

      this.resendSeconds--;
    }, 1000);
  }

  /** 清除重新寄送倒數。 */
  private clearResendTimer(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = null;
    }
  }
}
