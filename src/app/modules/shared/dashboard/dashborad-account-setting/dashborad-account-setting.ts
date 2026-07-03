import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  imports: [RouterLink, AccountDeletion, DashboardPasswordSetting],
  templateUrl: './dashborad-account-setting.html',
  styleUrl: './dashborad-account-setting.scss',
})
export class DashboradAccountSetting {
  /** 帳號基本資料由使用此共用元件的角色頁面傳入。 */
  @Input() account= {
    name: '',
    email: '',
    googleBound: false,
  };

  /** 不同角色可傳入自己的 Google 綁定頁。 */
  @Input() googleBindPath = '/';

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
  @Input() preview: DashboardAccountPreview = {
    pendingReviewCount: 0,
    pendingSelectionCount: 0,
  };

  /** 關閉帳號設定時通知外層角色頁面處理導頁。 */
  @Output() closed = new EventEmitter<void>();

  /** 修改密碼驗證通過後，將資料交給外層串接 API。 */
  @Output() passwordSaved = new EventEmitter<DashboardPasswordPayload>();

  passwordSettingOpen = false;

  openPasswordSetting(): void {
    this.passwordSettingOpen = true;
  }

  close(): void {
    this.closed.emit();
  }

  handlePasswordSaved(payload: DashboardPasswordPayload): void {
    this.passwordSaved.emit(payload);
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

export interface DashboardAccountPreview {
  pendingReviewCount: number;
  pendingSelectionCount: number;
}
