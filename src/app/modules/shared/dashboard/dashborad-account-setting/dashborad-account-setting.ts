import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import {
  AccountDeletion,
  AccountDeletionBlocker,
} from '../account-deletion/account-deletion';
import {
  DashboardPasswordPayload,
  DashboardPasswordSetting,
} from '../dashboard-password-setting/dashboard-password-setting';

@Component({
  selector: 'app-dashborad-account-setting',
  imports: [AccountDeletion, DashboardPasswordSetting],
  templateUrl: './dashborad-account-setting.html',
  styleUrl: './dashborad-account-setting.scss',
})
export class DashboradAccountSetting implements OnDestroy {
  private readonly closeAnimationMs = 150;
  private closeTimer?: number;

  /** 帳號基本資料由使用此共用元件的角色頁面傳入。 */
  @Input() account= {
    name: '',
    email: '',
    googleBound: false,
  };

  /** 不同角色可傳入自己的 Google 綁定頁。 */
  @Input() googleBinding = false;

  /** 註銷成功後返回的登入頁。 */
  @Input() loginPath = '/';

  /** 帳號角色名稱，顯示於註銷成功訊息。 */
  @Input() accountRoleLabel = '使用者';

  /** 註銷條件由各角色頁面或 API 回傳資料決定。 */
  @Input() accountDeletion: DashboardAccountDeletionConfig = {
    canDelete: false,
    blockers: [],
  };

  @Input() passwordRule = '至少 8 個字元，並包含英文字母與數字。';
  @Input() cancellationWarning = '若有活動正在進行中，將無法註銷帳號。';
  /** 關閉帳號設定時通知外層角色頁面處理導頁。 */
  @Output() closed = new EventEmitter<void>();

  /** 修改密碼驗證通過後，將資料交給外層串接 API。 */
  @Output() passwordSaved = new EventEmitter<DashboardPasswordPayload>();

  @Output() googleBindRequested = new EventEmitter<void>();

  passwordSettingOpen = false;
  isClosing = false;

  openPasswordSetting(): void {
    this.passwordSettingOpen = true;
  }

  close(): void {
    if (this.isClosing) {
      return;
    }

    this.isClosing = true;
    this.closeTimer = window.setTimeout(() => {
      this.closed.emit();
      this.isClosing = false;
    }, this.closeAnimationMs);
  }

  handlePasswordSaved(payload: DashboardPasswordPayload): void {
    this.passwordSaved.emit(payload);
  }

  requestGoogleBind(): void {
    if (this.account.googleBound || this.googleBinding) {
      return;
    }

    this.googleBindRequested.emit();
  }

  ngOnDestroy(): void {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
    }
  }
}

// export interface DashboardAccountData {
//   name: string;
//   email: string;
//   googleBound: boolean;
// }

export interface DashboardAccountDeletionConfig {
  canDelete: boolean;
  blockers: AccountDeletionBlocker[];
}

