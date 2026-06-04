import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorSidebar } from '../vendor-sidebar/vendor-sidebar';
import { AuthLogin } from '../auth-login/auth-login';
import { AuthRegister } from '../auth-register/auth-register';
// import { VendorForgotPassword } from "../../vendor/vendor-forgot-password/vendor-forgot-password";
import { AuthForgotPassword } from '../auth-forgot-password/auth-forgot-password';


type AuthMode = 'login' | 'register' | 'forgot';
type AuthRole = 'vendor' | 'organizer';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule, VendorSidebar, AuthLogin, AuthRegister, AuthForgotPassword],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit {
  role!: AuthRole;
  mode!: AuthMode;

  title = '';
  highlight = '';
  description = '';
  topText = '';
  topLinkText = '';
  topLink = '';
  systemName = '';
  formTitle = '';
  logoImg = '';
  forgotLink = '';

  email = '';
  password = '';
  checkPw = '';
  directorName = '';

  showPassword = false;
  showConfirmPassword = false;

  hasPwLenght = false;
  hasPwNumLetter = false;

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
    });
  }

  get isLogin(): boolean {
    return this.mode === 'login';
  }

  get isRegister(): boolean {
    return this.mode === 'register';
  }

  get isVendor(): boolean {
    return this.role === 'vendor';
  }

  get isOrganizer(): boolean {
    return this.role === 'organizer';
  }

  get isForgot(): boolean {
    return this.mode === 'forgot';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPwRole(): void {
    this.hasPwLenght = this.password.length >= 8;
    this.hasPwNumLetter = /[A-Za-z]/.test(this.password) && /\d/.test(this.password);
  }
}
