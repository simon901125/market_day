import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorSidebar } from '../vendor-sidebar/vendor-sidebar';
@Component({
  selector: 'app-vendor-forgot-password',
  imports: [CommonModule, FormsModule, VendorSidebar],
  templateUrl: './vendor-forgot-password.html',
  styleUrl: './vendor-forgot-password.scss',
})
export class VendorForgotPassword {
   email = '';

  sendVerifyCode() {
    console.log('寄送重設密碼驗證碼：', this.email);
  }
}
