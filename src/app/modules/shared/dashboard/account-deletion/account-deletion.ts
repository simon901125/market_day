import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';

@Component({
  selector: 'app-account-deletion',
  templateUrl: './account-deletion.html',
})
export class AccountDeletion {
  /** 註銷完成後導向的登入頁。 */
  @Input() loginPath = '/vendor/login';

  /** 帳號角色名稱，用於成功訊息。 */
  @Input() accountRoleLabel = '攤主';

  /** 註銷完成事件，供外層元件清除其他狀態。 */
  @Output() deleted = new EventEmitter<void>();

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
      await this.alert.error(
        '註銷帳號失敗',
        this.getErrorMessage(error),
        '我知道了'
      );
    } finally {
      this.isDeleting = false;
    }
  }

  private getApiMessage(message?: string): string {
    return message || '目前無法註銷帳號，請完成進行中的事項後再試。';
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
