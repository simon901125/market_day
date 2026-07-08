import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';

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

  private isDeleting = false;

  constructor(
    private readonly alert: AlertService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /** 送出停用目前登入帳號的 API，成功後清除登入狀態並返回登入頁。 */
  async requestDeletion(): Promise<void> {
    if (this.isDeleting) {
      return;
    }

    const confirmed = await this.alert.confirm(
      '註銷帳號確認',
      `確定要註銷您的${this.accountRoleLabel}帳號嗎？<br>註銷後將無法復原。`,
      '確定註銷',
      '取消'
    );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;

    try {
      const response = await firstValueFrom(this.authService.deactivateAccount());

      if (!isApiSuccessStatus(response.statusCode)) {
        this.blocked.emit(this.blockers);
        await this.alert.warning(
          '目前無法註銷帳號',
          this.getApiMessage(response.message),
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
        `您的${this.accountRoleLabel}帳號已成功註銷，帳號已停用。<br>感謝您使用小集日。`,
        '返回登入頁'
      );
    } catch (error: unknown) {
      this.blocked.emit(this.blockers);
      await this.alert.error(
        '註銷帳號失敗',
        this.getErrorMessage(error),
        '我知道了'
      );
    } finally {
      this.isDeleting = false;
    }
  }

  /** 將後端回傳的阻擋原因整理成標準 Alert 可顯示的訊息。 */
  private getBlockedMessage(): string {
    const reasons = this.blockers.length
      ? this.blockers.map((blocker) => blocker.text).join('、')
      : '進行中的報名、待付款或未完成活動';

    return `您的帳號仍有${reasons}，<br>請完成相關事項後，再重新申請註銷帳號。`;
  }

  private getApiMessage(message?: string): string {
    return message || this.getBlockedMessage();
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return this.getApiMessage(error.error?.message);
    }

    if (error instanceof Error) {
      return error.message;
    }

    return '註銷帳號時發生錯誤，請稍後再試。';
  }
}
