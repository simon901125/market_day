import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  email = '';
  password = '';
  showPassword = false;

  constructor(private readonly router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  loginAdmin(): void {
    sessionStorage.setItem('isLogin', 'true');
    sessionStorage.setItem('userRole', 'admin');
    sessionStorage.setItem('account', this.email);

    this.router.navigate(['/admin/dash-board/home']);
  }
}
