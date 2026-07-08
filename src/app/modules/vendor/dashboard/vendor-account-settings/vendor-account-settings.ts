import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountDeletionBlocker } from '../../../shared/dashboard/account-deletion/account-deletion';
import { DashboradAccountSetting } from '../../../shared/dashboard/dashborad-account-setting/dashborad-account-setting';
import { AuthPortalRole } from '../../../../models/interface/shared/Auth';

import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-vendor-account-settings',
  imports: [DashboradAccountSetting],
  templateUrl: './vendor-account-settings.html',
})


export class VendorAccountSettings {
  /** 帳號資料目前先以假資料綁定，之後可替換成會員 API 回傳結果。 */
  /** 使用者名稱 */
  userName = '使用者';
  /** 使用者電子郵箱 */
  userEmail = '';
  /** 使用者角色 */
  role: AuthPortalRole = 'vendor';
  
  /** 帳號資料 */
  account = {
    email: this.userEmail,
    name: this.userName,
    googleBound: false
  };

  constructor(
    private router: Router,
    private authService: AuthService) {

      this.loadUserInfo();
    }



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

  

  /** 關閉帳號設定時回到攤主後台首頁。 */
  close(): void {
    this.router.navigate(['/vendor/dash-board/home']);
  }

  private loadUserInfo(){
    let userInfo = this.authService.getUser(this.role);

    if (!userInfo) {
      return;
    }
    let name = userInfo.name?.trim() || '使用者';
    this.account.name = name;
    this.account.email = userInfo.email || '';
    console.log('userInfo', userInfo);

  }


}
