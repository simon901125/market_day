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
  showPassword = false;
  showConfirmPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
