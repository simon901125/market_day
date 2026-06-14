import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-password-settings',
  imports: [FormsModule],
  templateUrl: './vendor-password-settings.html',
  styleUrl: './vendor-password-settings.scss',
})
export class VendorPasswordSettings {
  /** 表單資料以 ngModel 綁定，後續串接 API 時可直接轉成 payload。 */
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  /** 控制各密碼欄位是否顯示明碼。 */
  visible = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  readonly passwordRule = '至少 8 個字元，並包含英文與數字。';

  constructor(private router: Router) {}

  /** 切換指定密碼欄位的顯示狀態。 */
  toggleVisible(field: keyof typeof this.visible): void {
    this.visible[field] = !this.visible[field];
  }

  /** 關閉修改密碼視窗時回到帳號設定。 */
  close(): void {
    this.router.navigate(['/vendor/dash-board/account-settings']);
  }

  /** 目前先回到帳號設定，之後可在這裡串接修改密碼 API。 */
  save(): void {
    this.close();
  }
}
