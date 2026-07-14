import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { getPendingRegistrationEmailKey } from '../../../core/auth/auth-storage.constants';
import { AlertService } from '../../../core/services/alert.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { isApiSuccessStatus } from '../../../models/interface/shared/ApiResult';

type RegisterRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.scss',
})
export class AuthRegister implements OnInit {
  @Input() formTitle = '';
  @Input() vertifyLink = '';
  @Input() role: RegisterRole = 'vendor';

  directorName = '';
  email = '';
  password = '';
  checkPw = '';
  showPassword = false;
  showConfirmPassword = false;
  hasPwLenght = false;
  hasPwNumLetter = false;
  passwordNotMatch = false;
  isSubmitting = false;
  isGoogleSubmitting = false;

  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private readonly alert: AlertService,
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const pendingEmail = sessionStorage
      .getItem(getPendingRegistrationEmailKey(this.role))
      ?.trim();

    if (pendingEmail && this.isValidEmail(pendingEmail)) {
      this.email = pendingEmail;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPwRole(): void {
    this.hasPwLenght = this.password.length >= 8;
    this.hasPwNumLetter =
      /[A-Za-z]/.test(this.password) && /\d/.test(this.password);
    this.checkPasswordMatch();
  }

  checkPasswordMatch(): void {
    this.passwordNotMatch =
      this.checkPw.length > 0 && this.password !== this.checkPw;
  }

  async register(): Promise<void> {
    if (this.isSubmitting || this.isGoogleSubmitting) {
      return;
    }

    this.checkPwRole();
    this.checkPasswordMatch();

    const email = this.email.trim();
    const isInvalid =
      !this.directorName.trim() ||
      !email ||
      !this.password ||
      !this.checkPw ||
      !this.hasPwLenght ||
      !this.hasPwNumLetter ||
      this.passwordNotMatch;

    if (isInvalid) {
      await this.alert.error(
        '註冊資料不完整',
        '請確認姓名、Email、密碼及確認密碼皆已正確填寫。',
        '重新檢查'
      );
      return;
    }

    if (!this.isValidEmail(email)) {
      await this.alert.error(
        'Email 格式錯誤',
        '請輸入正確的 Email 格式。',
        '重新輸入'
      );
      return;
    }

    // Preserve the recovery target before the request. The backend may have
    // created the pending account even if the response or page later fails.
    this.savePendingRegistrationEmail(email);
    this.isSubmitting = true;

    try {
      const response = await firstValueFrom(
        this.authService.register(this.role, {
          name: this.directorName.trim(),
          email,
          password: this.password,
        })
      );

      // The API may return a duplicate Email as a business result even when
      // the HTTP request itself succeeds, so inspect the message first.
      if (this.isEmailAlreadyRegisteredMessage(response.message)) {
        await this.offerPendingEmailVerification(email);
        return;
      }

      if (!isApiSuccessStatus(response.statusCode)) {
        await this.alert.error(
          '註冊失敗',
          this.getRegisterApiMessage(response.message),
          '重新檢查'
        );
        return;
      }

      await this.goVerifyEmail(email);
    } catch (error: unknown) {
      if (this.isEmailAlreadyRegisteredError(error)) {
        await this.offerPendingEmailVerification(email);
        return;
      }

      await this.alert.error(
        '註冊失敗',
        this.getRegisterErrorMessage(error),
        '重新檢查'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  async registerWithGoogle(): Promise<void> {
    if (this.isSubmitting || this.isGoogleSubmitting) {
      return;
    }

    this.isGoogleSubmitting = true;

    try {
      const credential = await this.googleAuthService.getCredential();
      const email = this.googleAuthService.getEmailFromCredential(credential);
      const response = await firstValueFrom(
        this.authService.googleRegister(this.role, { credential })
      );

      if (!isApiSuccessStatus(response.statusCode)) {
        await this.alert.error(
          'Google 註冊失敗',
          this.getGoogleRegisterApiMessage(response.message),
          '重新操作'
        );
        return;
      }

      await this.goVerifyEmail(email);
    } catch (error: unknown) {
      await this.alert.error(
        'Google 註冊失敗',
        this.getGoogleRegisterErrorMessage(error),
        '重新操作'
      );
    } finally {
      this.isGoogleSubmitting = false;
    }
  }

  private async goVerifyEmail(email: string | null): Promise<void> {
    if (email) {
      this.savePendingRegistrationEmail(email);
    }

    await this.alert.success(
      '驗證碼已寄出',
      email
        ? `6 位數驗證碼已寄送至<br>${email}`
        : '6 位數驗證碼已寄送至你的 Google Email。',
      '前往驗證'
    );

    if (email) {
      await this.navigateToEmailVerification(email);
      return;
    }

    await this.router.navigate([
      this.vertifyLink || `/${this.role}/verify-email`,
    ]);
  }

  private isValidEmail(email: string): boolean {
    return this.emailPattern.test(email);
  }

  private savePendingRegistrationEmail(email: string): void {
    sessionStorage.setItem(
      getPendingRegistrationEmailKey(this.role),
      email.trim()
    );
  }

  private navigateToEmailVerification(email: string): Promise<boolean> {
    return this.router.navigate(
      [this.vertifyLink || `/${this.role}/verify-email`],
      { queryParams: { email } }
    );
  }

  private async offerPendingEmailVerification(email: string): Promise<void> {
    this.savePendingRegistrationEmail(email);
    const shouldVerify = await this.alert.confirm(
      '此 Email 尚未完成驗證',
      `驗證碼已寄送至<br>${email}<br>請前往驗證頁完成註冊。`,
      '前往驗證',
      '取消'
    );

    if (shouldVerify) {
      try {
        const response = await firstValueFrom(
          this.authService.resendRegistrationVerificationCode({ email })
        );

        if (!isApiSuccessStatus(response.statusCode)) {
          await this.alert.error(
            '驗證碼寄送失敗',
            this.getVerificationResendMessage(response.message),
            '重新嘗試'
          );
          return;
        }

        await this.navigateToEmailVerification(email);
      } catch (error: unknown) {
        await this.alert.error(
          '驗證碼寄送失敗',
          this.getVerificationResendErrorMessage(error),
          '重新嘗試'
        );
      }
    }
  }

  private isEmailAlreadyRegisteredError(error: unknown): boolean {
    return this.isEmailAlreadyRegisteredMessage(
      this.getHttpErrorMessage(error)
    );
  }

  private isEmailAlreadyRegisteredMessage(message: unknown): boolean {
    if (typeof message !== 'string') {
      return false;
    }

    const normalizedMessage = message.trim().toLowerCase();
    return (
      normalizedMessage.includes('email already registered') ||
      normalizedMessage.includes('email has already register') ||
      /email.*(?:已|被).*註冊/i.test(message)
    );
  }

  private getHttpErrorMessage(error: unknown): string | undefined {
    if (!(error instanceof HttpErrorResponse)) {
      return undefined;
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    return error.error?.message ?? error.error?.error?.message ?? error.message;
  }

  private getRegisterErrorMessage(error: unknown): string {
    const message = this.getHttpErrorMessage(error);
    if (message) {
      return this.getRegisterApiMessage(message);
    }

    return '註冊時發生錯誤，請稍後再試。';
  }

  private getGoogleRegisterErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return this.getGoogleRegisterApiMessage(error.error?.message);
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Google 註冊時發生錯誤，請稍後再試。';
  }

  private getRegisterApiMessage(message?: string): string {
    if (this.isEmailAlreadyRegisteredMessage(message)) {
      return '此 Email 已經註冊，請直接前往驗證或登入。';
    }

    switch (message) {
      case 'Validation failed: password: Password must be at least 8 characters and contain letters and numbers':
        return '密碼需至少 8 碼，並同時包含英文字母與數字。';
      default:
        return message || '註冊失敗，請確認資料後再試。';
    }
  }

  private getVerificationResendMessage(message?: string): string {
    switch (message) {
      case 'Email already verified':
      case '此 Email 已完成驗證':
        return '此 Email 已完成驗證，請直接登入。';
      case 'Local account not found':
      case '找不到此本地帳號':
        return '找不到此待驗證帳號，請重新註冊。';
      default:
        return message || '無法重新寄送驗證碼，請稍後再試。';
    }
  }

  private getVerificationResendErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        return '後端尚未載入驗證碼重寄功能，請重新啟動後端後再試。';
      }

      if (error.status === 0) {
        return '無法連線至後端服務，請確認後端已啟動。';
      }
    }

    return this.getVerificationResendMessage(this.getHttpErrorMessage(error));
  }

  private getGoogleRegisterApiMessage(message?: string): string {
    switch (message) {
      case 'Google account has already register':
      case 'Email already registered':
        return '此 Google 帳號已經註冊，請改用登入。';
      case 'Invalid Google credential':
        return 'Google 註冊憑證無效，請重新操作。';
      case 'Google credential is required':
        return '缺少 Google 註冊憑證，請重新操作。';
      case 'Email is not verified':
        return '此 Google 帳號尚未完成 Email 驗證，請先完成驗證。';
      case 'Account is not active':
        return '此帳號目前無法使用，請聯絡系統管理員。';
      default:
        return message || 'Google 註冊失敗，請稍後再試。';
    }
  }
}
