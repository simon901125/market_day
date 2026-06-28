import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { getPendingRegistrationEmailKey } from '../../../core/auth/auth-storage.constants';
import { AlertService } from '../../../core/services/alert.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';

type RegisterRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.scss',
})
export class AuthRegister {
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

    this.isSubmitting = true;

    try {
      const response = await firstValueFrom(
        this.authService.register(this.role, {
          name: this.directorName.trim(),
          email,
          password: this.password,
        })
      );

      if (
        response.statusCode !== 200 ||
        !response.message.includes('registered successfully')
      ) {
        await this.alert.error(
          '註冊失敗',
          this.getRegisterApiMessage(response.message),
          '重新檢查'
        );
        return;
      }

      await this.goVerifyEmail(email);
    } catch (error: unknown) {
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

      if (
        response.statusCode !== 200 ||
        !response.message.includes('registered successfully')
      ) {
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
      sessionStorage.setItem(getPendingRegistrationEmailKey(this.role), email);
    }

    await this.alert.success(
      '驗證碼已寄出',
      email
        ? `6 位數驗證碼已寄送至<br>${email}`
        : '6 位數驗證碼已寄送至你的 Google Email。',
      '前往驗證'
    );

    if (email) {
      await this.router.navigate(
        [this.vertifyLink || `/${this.role}/verify-email`],
        { queryParams: { email } }
      );
      return;
    }

    await this.router.navigate([
      this.vertifyLink || `/${this.role}/verify-email`,
    ]);
  }

  private isValidEmail(email: string): boolean {
    return this.emailPattern.test(email);
  }

  private getRegisterErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return this.getRegisterApiMessage(error.error?.message);
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
    switch (message) {
      case 'Email already registered':
        return '此 Email 已經註冊，請改用登入或使用其他 Email。';
      case 'Validation failed: password: Password must be at least 8 characters and contain letters and numbers':
        return '密碼需至少 8 碼，並同時包含英文字母與數字。';
      default:
        return message || '註冊失敗，請確認資料後再試。';
    }
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
