import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorSidebar } from '../vendor-sidebar/vendor-sidebar';
import { AuthLogin } from '../auth-login/auth-login';
import { AuthRegister } from '../auth-register/auth-register';
import { AuthForgotPassword } from '../auth-forgot-password/auth-forgot-password';
import { AuthVerifyEmail } from '../auth-verify-email/auth-verify-email';
import { AuthResetPassword } from '../auth-reset-password/auth-reset-password';
import { RouterLink } from '@angular/router';

/** 身份驗證模式 */
type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'verify';
/** 身分角色 */
type AuthRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    VendorSidebar,
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
  role!: AuthRole;
  mode!: AuthMode;
  /** 身分驗證：標題 */
  title = '';
  /** 身分驗證：左側大標 */
  highlight = '';
  /** 身分驗證：左側描述 */
  description = '';
  /** 身分驗證：右上方路徑指引 */
  topText = '';
  /** 身分驗證：右上方路徑路由(文字) */
  topLinkText = '';
  /** 身分驗證：右上方路徑路由(路由) */
  topLink = '';
  /** 身分驗證：當前頁面 */
  systemName = '';
  /** 身分驗證：表單標題 */
  formTitle = '';
  /** 身分驗證：logo路徑 */
  logoImg = '';
  /** 身分驗證：忘記密碼路由 */
  forgotLink = '';
  /** 身分驗證：重設密碼 登入路由 */
  loginLink = '';
  /** 身分驗證：重設密碼 註冊路由 */
  backLink = '';
  /** 身分驗證：忘記密碼導至email驗證 */
  vertifyLink = '';
  
  /** 是否顯示email驗證成功彈跳視窗 */
  showSuccessModal = false;
  /** 是否顯示email驗證失敗彈跳視窗 */
  showErrorModal = false;
  /** 是否顯示resetPassword成功彈跳視窗 */
  showResetSuccessModal = false;


  // /** 電子郵件 */
  // email = '';
  // /** 密碼 */
  // password = '';
  // /**  */
  // checkPw = '';
  // directorName = '';
  // showPassword = false;
  // showConfirmPassword = false;


  constructor(private route: ActivatedRoute) {}

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
      this.systemName = data['systemName'] ?? '';
      this.formTitle = data['formTitle'];
      this.logoImg = data['logoImg'];
      this.forgotLink = data['forgotLink'] ?? '';
      this.loginLink = data['loginLink'] ?? '';
      this.backLink = data['backLink'] ?? '';
      this.vertifyLink = data['vertifyLink'] ?? '';
    });
  }

  /** 是否為登入 */
  get isLogin(): boolean {
    return this.mode === 'login';
  }

  /** 是否為註冊 */
  get isRegister(): boolean {
    return this.mode === 'register';
  }

  /** 是否為攤主 */
  get isVendor(): boolean {
    return this.role === 'vendor';
  }

  /** 是否為主辦方 */
  get isOrganizer(): boolean {
    return this.role === 'organizer';
  }

  /** 是否為忘記密碼 */
  get isForgot(): boolean {
    return this.mode === 'forgot';
  }

  /** 是否為重設密碼 */
  get isReset(): boolean {
    return this.mode === 'reset';
  }

  /** 是否為email驗證 */
  get isVerify(): boolean {
    return this.mode === 'verify';
  }

  // /** 顯示密碼 */
  // togglePassword(): void {
  //   this.showPassword = !this.showPassword;
  // }
  // /** 顯示確認密碼 */
  // toggleConfirmPassword(): void {
  //   this.showConfirmPassword = !this.showConfirmPassword;
  // }

  /** 開啟驗證email成功視窗 */
  openSuccessModal() {
    this.showSuccessModal = true;
    this.showErrorModal = false;
  }
  /** 開啟驗證email失敗視窗 */
  openErrorModal() {
    this.showErrorModal = true;
    this.showSuccessModal = false;
  }
  /** 關閉驗證email視窗 */
  closeModal() {
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }

  /** 開啟reset password 彈跳視窗 */
  openResetSuccessModal() {
    this.showResetSuccessModal = true;
  }
}
