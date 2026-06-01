import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VendorSidebar } from '../vendor-sidebar/vendor-sidebar';
@Component({
  selector: 'app-vendor-login',
  imports: [RouterModule, VendorSidebar],
  templateUrl: './vendor-login.html',
  styleUrl: './vendor-login.scss',
})
export class VendorLogin {
  /** 是否顯示密碼 */
  showPassword = false;
  /** 切換密碼顯示狀態 */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
