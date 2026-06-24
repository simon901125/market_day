import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  loginAdmin(): void {
    console.log('admin login', this.email, this.password);
  }
}