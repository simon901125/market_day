import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-password-setting',
  imports: [FormsModule],
  templateUrl: './dashboard-password-setting.html',
  // 沿用原有密碼彈窗 SCSS，僅將檔案移至共用元件目錄。
  styleUrl: './dashboard-password-setting.scss',
})
export class DashboardPasswordSetting {
  /** 控制修改密碼彈窗是否顯示，可由父元件使用雙向綁定。 */
  @Input() open = false;

  /** 關閉彈窗時同步更新父元件的顯示狀態。 */
  @Output() openChange = new EventEmitter<boolean>();

  /** 表單驗證通過後，將密碼資料交由父元件或 API service 處理。 */
  @Output() saved = new EventEmitter<DashboardPasswordPayload>();

  /** 密碼表單使用雙向綁定，之後串接 API 時可直接轉成 request payload。 */
  passwordForm: DashboardPasswordPayload = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  /** 控制三個密碼欄位是否顯示明碼。 */
  visible: Record<keyof DashboardPasswordPayload, boolean> = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  readonly passwordRule = '至少 8 個字元，並包含英文字母與數字。';
  errorMessage = '';

  /** 切換指定欄位的明碼顯示狀態。 */
  toggleVisible(field: keyof DashboardPasswordPayload): void {
    this.visible[field] = !this.visible[field];
  }

  /** 點擊遮罩空白處時關閉彈窗，點擊內容本身不受影響。 */
  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /** 清空敏感資料並通知父元件關閉彈窗。 */
  close(): void {
    this.resetForm();
    this.openChange.emit(false);
  }

  /** 驗證密碼規則與兩次輸入結果，通過後送出資料。 */
  save(): void {
    this.errorMessage = this.validateForm();

    if (this.errorMessage) {
      return;
    }

    this.saved.emit({ ...this.passwordForm });
    this.close();
  }

  private validateForm(): string {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return '請完整填寫所有密碼欄位。';
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPassword)) {
      return this.passwordRule;
    }

    if (newPassword !== confirmPassword) {
      return '新密碼與確認新密碼不一致。';
    }

    return '';
  }

  private resetForm(): void {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.visible = {
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    };
    this.errorMessage = '';
  }
}

export interface DashboardPasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
