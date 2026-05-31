import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VendorSidebar } from '../vendor-sidebar/vendor-sidebar';

@Component({
  selector: 'app-vendor-register',
  imports: [RouterModule, VendorSidebar],
  templateUrl: './vendor-register.html',
  styleUrl: './vendor-register.scss',
})
export class VendorRegister {
  /** 是否顯示密碼 */
  showPassword = false;
  /** 是否顯示確認密碼 */
  showConfirmPassword = false;

  /** 切換密碼顯示狀態 */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /** 切換確認密碼顯示狀態 */
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
