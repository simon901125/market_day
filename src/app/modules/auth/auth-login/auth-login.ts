import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-auth-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLogin {
  @Input() formTitle = '';
  @Input() forgotLink = '';
  
  email = '';
  password = '';
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
