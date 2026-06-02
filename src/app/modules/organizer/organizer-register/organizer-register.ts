import { Component } from '@angular/core';
import { OrganizerSidebar } from "../organizer-sidebar/organizer-sidebar";

@Component({
  selector: 'app-organizer-register',
  imports: [OrganizerSidebar],
  templateUrl: './organizer-register.html',
  styleUrl: './organizer-register.scss',
})
export class OrganizerRegister {
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
