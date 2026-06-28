import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';

export interface AccountDeletionBlocker {
  /** 阻擋註銷的原因代碼，方便未來與後端狀態對應。 */
  type: string;

  /** 顯示於提示訊息中的中文原因。 */
  text: string;
}

@Component({
  selector: 'app-account-deletion',
  templateUrl: './account-deletion.html',
})
export class AccountDeletion {
  /** 是否符合註銷條件，之後可直接綁定 API 回傳結果。 */
  @Input() canDelete = false;

  /** 註銷完成後導向的登入頁。 */
  @Input() loginPath = '/vendor/login';

  /** 帳號角色名稱，用於成功訊息。 */
  @Input() accountRoleLabel = '攤主';

  /** 無法註銷時的原因清單。 */
  @Input() blockers: AccountDeletionBlocker[] = [];

  /** 註銷完成事件，供外層元件串接 API 或清除其他狀態。 */
  @Output() deleted = new EventEmitter<void>();

  /** 註銷受阻事件，供外層元件記錄或處理原因。 */
  @Output() blocked = new EventEmitter<AccountDeletionBlocker[]>();

  constructor(
    private readonly alert: AlertService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /** 依帳號狀態顯示無法註銷提示，或完成註銷並返回登入頁。 */
  async requestDeletion(): Promise<void> {
    if (!this.canDelete) {
      this.blocked.emit(this.blockers);

      await this.alert.warning(
        '目前無法註銷帳號',
        this.getBlockedMessage(),
        '我知道了'
      );
      return;
    }

    const role = this.authService.getRoleFromUrl(this.loginPath) ?? 'vendor';
    this.authService.clearSession(role);
    this.deleted.emit();

    await this.router.navigate([this.loginPath]);
    await this.alert.success(
      '帳號已成功註銷',
      `您的${this.accountRoleLabel}帳號已成功註銷，所有個人資料、品牌資料與報名紀錄已完成刪除。<br>感謝您使用小集日。`,
      '返回登入頁'
    );
  }

  /** 將後端回傳的阻擋原因整理成標準 Alert 可顯示的訊息。 */
  private getBlockedMessage(): string {
    const reasons = this.blockers.length
      ? this.blockers.map((blocker) => blocker.text).join('、')
      : '進行中的報名、待付款或未完成活動';

    return `您的帳號仍有${reasons}，<br>請完成相關事項後，再重新申請註銷帳號。`;
  }
}
