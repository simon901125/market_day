import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-auth-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.scss',
})
export class AuthRegister {
  @Input() formTitle = '';

  directorName = '';
  email = '';
  password = '';
  checkPw = '';

  showPassword = false;
  showConfirmPassword = false;

  hasPwLenght = false;
  hasPwNumLetter = false;

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
