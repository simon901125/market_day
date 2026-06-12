import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-verify-email',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-verify-email.html',
  styleUrl: './auth-verify-email.scss',
})
export class AuthVerifyEmail implements OnInit, OnDestroy {
  /** 驗證碼輸入框 */
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  /** 身分驗證：表單標題 */
  @Input() formTitle = '';

  /** 身分驗證：返回註冊路由 */
  @Input() backLink = '';

  /** 身分驗證：登入路由 */
  @Input() loginLink = '';

  /** 呼叫 email 驗證成功 */
  @Output() verifySuccess = new EventEmitter<void>();

  /** 呼叫 email 驗證失敗 */
  @Output() verifyError = new EventEmitter<void>();

  /** 電子信箱 */
  email = 'vendor@example.com';

  /** 驗證碼 */
  code = ['', '', '', '', '', ''];

  /** 是否顯示成功視窗 */
  showSuccessModal = false;

  /** 是否顯示失敗視窗 */
  showErrorModal = false;

  /** 重新寄送倒數秒數 */
  resendSeconds = 56;

  /** 倒數計時器 */
  private resendTimer: ReturnType<typeof setInterval> | null = null;

  /** 元件初始化 */
  ngOnInit(): void {
    this.startResendCountdown();
  }

  /** 元件銷毀時清除計時器 */
  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  /** 輸入驗證碼後自動跳下一格 */
  onCodeInput(value: string, index: number): void {
    const onlyNumber = value.replace(/\D/g, '').slice(-1);
    this.code[index] = onlyNumber;

    if (onlyNumber && index < this.code.length - 1) {
      this.focusCodeInput(index + 1);
    }
  }

  /** 刪除時若目前欄位是空的，自動回上一格 */
  onCodeBackspace(index: number): void {
    if (!this.code[index] && index > 0) {
      this.focusCodeInput(index - 1);
    }
  }

  /** 聚焦指定驗證碼輸入框 */
  private focusCodeInput(index: number): void {
    const input = this.codeInputs.get(index)?.nativeElement;

    if (input) {
      input.focus();
      input.select();
    }
  }

  /** 檢查驗證碼 */
  verifyCode(): void {
    const fullCode = this.code.join('');

    if (fullCode === '123456') {
      this.showSuccessModal = true;
      this.showErrorModal = false;
      this.verifySuccess.emit();
      return;
    }

    this.showErrorModal = true;
    this.showSuccessModal = false;
    this.verifyError.emit();
  }

  /** 關閉訊息視窗 */
  closeModal(): void {
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }

  /** 重新寄送驗證碼 */
  resendCode(): void {
    if (this.resendSeconds > 0) {
      return;
    }

    console.log('重新寄送驗證碼');

    this.resendSeconds = 56;
    this.startResendCountdown();
  }

  /** 開始重新寄送倒數 */
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

  /** 清除重新寄送倒數計時器 */
  private clearResendTimer(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = null;
    }
  }
}