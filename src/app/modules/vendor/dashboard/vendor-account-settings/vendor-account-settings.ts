import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountDeletionBlocker } from '../../../shared/dashboard/account-deletion/account-deletion';
import { DashboradAccountSetting } from '../../../shared/dashboard/dashborad-account-setting/dashborad-account-setting';

@Component({
  selector: 'app-vendor-account-settings',
  imports: [DashboradAccountSetting],
  templateUrl: './vendor-account-settings.html',
})
export class VendorAccountSettings {
  /** 帳號資料目前先以假資料綁定，之後可替換成會員 API 回傳結果。 */
  readonly account = {
    name: '董映彤',
    email: 'yingtung0909@gmail.com',
    googleBound: false,
  };

  /** 密碼規則集中在 TS，template 只負責顯示。 */
  readonly passwordRule = '至少 8 個字元，並包含英文與數字。';

  /** 註銷提醒集中管理，之後可依帳號狀態改成 API 回傳。 */
  readonly cancellationWarning = '若有活動正在進行中，將無法註銷帳號。';

  /** 註銷帳號資料，未來可改由 API 回傳 canDelete 與 blockers。 */
  readonly accountDeletion = {
    canDelete: false,
    blockers: [
      { type: 'active-registration', text: '進行中的報名' },
      { type: 'pending-payment', text: '待付款' },
      { type: 'unfinished-event', text: '未完成活動' },
    ] satisfies AccountDeletionBlocker[],
  };

  readonly preview = {
    pendingReviewCount: 12,
    pendingSelectionCount: 2,
  };

  constructor(private router: Router) {}

  /** 關閉帳號設定時回到攤主後台首頁。 */
  close(): void {
    this.router.navigate(['/vendor/dash-board/home']);
  }
}
