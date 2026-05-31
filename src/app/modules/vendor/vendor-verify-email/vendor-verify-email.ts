import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorSidebar } from '../vendor-sidebar/vendor-sidebar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor-verify-email',
  imports: [CommonModule, VendorSidebar, FormsModule, RouterLink],
  templateUrl: './vendor-verify-email.html',
  styleUrl: './vendor-verify-email.scss',
})
export class VendorVerifyEmail {
  email = 'vendor@example.com';
  code = ['', '', '', '', '', ''];

  showSuccessModal = false;
  showErrorModal = false;

  verifyCode() {
    const fullCode = this.code.join('');

    if (fullCode === '123456') {
      this.showSuccessModal = true;
    } else {
      this.showErrorModal = true;
    }
  }

  closeModal() {
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }

  resendCode() {
    console.log('重新寄送驗證碼');
  }
}
