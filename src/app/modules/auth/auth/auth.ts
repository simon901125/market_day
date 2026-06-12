import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthLayout } from '../auth-layout/auth-layout';
import { AuthLogin } from '../auth-login/auth-login';
import { AuthRegister } from '../auth-register/auth-register';
import { AuthForgotPassword } from '../auth-forgot-password/auth-forgot-password';
import { AuthVerifyEmail } from '../auth-verify-email/auth-verify-email';
import { AuthResetPassword } from '../auth-reset-password/auth-reset-password';

/** 身分驗證模式 */
type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'verify';

/** 身分角色 */
type AuthRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AuthLayout,
    AuthLogin,
    AuthRegister,
    AuthForgotPassword,
    AuthResetPassword,
    AuthVerifyEmail,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit {
  /** 目前角色：攤主 / 主辦方 */
  role!: AuthRole;

  /** 目前頁面模式 */
  mode!: AuthMode;

  /** 左側主標題 */
  title = '';

  /** 左側強調文字 */
  highlight = '';

  /** 左側說明文字 */
  description = '';

  /** 右上方提示文字 */
  topText = '';

  /** 右上方連結文字 */
  topLinkText = '';

  /** 右上方連結路徑 */
  topLink = '';

  /** 表單標題 */
  formTitle = '';

  /** Logo 圖片路徑 */
  logoImg = '';

  /** 忘記密碼頁路徑 */
  forgotLink = '';

  /** 登入頁路徑 */
  loginLink = '';

  /** 返回上一頁路徑 */
  backLink = '';

  /** 驗證 Email 頁路徑 */
  vertifyLink = '';

  /** 是否顯示 Email 驗證成功彈跳視窗 */
  showSuccessModal = false;

  /** 是否顯示 Email 驗證失敗彈跳視窗 */
  showErrorModal = false;

  /** 是否顯示重設密碼成功彈跳視窗 */
  showResetSuccessModal = false;

  constructor(private route: ActivatedRoute) {}

  /** 初始化：讀取路由 data，決定角色與頁面內容 */
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.role = data['role'];
      this.mode = data['mode'];

      this.title = data['title'];
      this.highlight = data['highlight'];
      this.description = data['description'];
      this.topText = data['topText'];
      this.topLinkText = data['topLinkText'];
      this.topLink = data['topLink'];
      this.formTitle = data['formTitle'];
      this.logoImg = data['logoImg'];

      this.forgotLink = data['forgotLink'] ?? '';
      this.loginLink = data['loginLink'] ?? '';
      this.backLink = data['backLink'] ?? '';
      this.vertifyLink = data['vertifyLink'] ?? '';
    });
  }

  /** 是否為登入頁 */
  get isLogin(): boolean {
    return this.mode === 'login';
  }

  /** 是否為註冊頁 */
  get isRegister(): boolean {
    return this.mode === 'register';
  }

  /** 是否為忘記密碼頁 */
  get isForgot(): boolean {
    return this.mode === 'forgot';
  }

  /** 是否為重設密碼頁 */
  get isReset(): boolean {
    return this.mode === 'reset';
  }

  /** 是否為 Email 驗證頁 */
  get isVerify(): boolean {
    return this.mode === 'verify';
  }

  /** 開啟 Email 驗證成功彈跳視窗 */
  openSuccessModal(): void {
    this.showSuccessModal = true;
    this.showErrorModal = false;
  }

  /** 開啟 Email 驗證失敗彈跳視窗 */
  openErrorModal(): void {
    this.showErrorModal = true;
    this.showSuccessModal = false;
  }

  /** 關閉 Email 驗證彈跳視窗 */
  closeModal(): void {
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }

  /** 開啟重設密碼成功彈跳視窗 */
  openResetSuccessModal(): void {
    this.showResetSuccessModal = true;
  }
}