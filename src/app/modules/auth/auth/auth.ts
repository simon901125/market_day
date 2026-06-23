import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthForgotPassword } from '../auth-forgot-password/auth-forgot-password';
import { AuthLayout } from '../auth-layout/auth-layout';
import { AuthLogin } from '../auth-login/auth-login';
import { AuthRegister } from '../auth-register/auth-register';
import { AuthResetPassword } from '../auth-reset-password/auth-reset-password';
import { AuthVerifyEmail } from '../auth-verify-email/auth-verify-email';

/** 驗證頁面模式。 */
type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'verify';

/** 驗證頁面角色。 */
type AuthRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
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
  /** 目前登入角色。 */
  role!: AuthRole;

  /** 目前頁面模式。 */
  mode!: AuthMode;

  /** 左側主標題。 */
  title = '';

  /** 左側強調文字。 */
  highlight = '';

  /** 左側說明文字。 */
  description = '';

  /** 右上角提示文字。 */
  topText = '';

  /** 右上角連結文字。 */
  topLinkText = '';

  /** 右上角連結。 */
  topLink = '';

  /** 表單標題。 */
  formTitle = '';

  /** Logo 圖片路徑。 */
  logoImg = '';

  /** 忘記密碼頁連結。 */
  forgotLink = '';

  /** 登入頁連結。 */
  loginLink = '';

  /** 返回頁連結。 */
  backLink = '';

  /** Email 驗證頁連結。 */
  vertifyLink = '';

  constructor(private readonly route: ActivatedRoute) {}

  /** 依路由設定切換不同註冊登入畫面。 */
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
      this.vertifyLink = data['vertifyLink'] ?? data['verifyLink'] ?? '';
    });
  }

  /** 是否為登入頁。 */
  get isLogin(): boolean {
    return this.mode === 'login';
  }

  /** 是否為註冊頁。 */
  get isRegister(): boolean {
    return this.mode === 'register';
  }

  /** 是否為忘記密碼頁。 */
  get isForgot(): boolean {
    return this.mode === 'forgot';
  }

  /** 是否為重設密碼頁。 */
  get isReset(): boolean {
    return this.mode === 'reset';
  }

  /** 是否為 Email 驗證頁。 */
  get isVerify(): boolean {
    return this.mode === 'verify';
  }
}
