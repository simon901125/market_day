import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { MarketDayUser } from '../../../../models/interface/shared/Auth';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';

@Component({
  selector: 'app-organizer-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './organizer-header.html',
  styleUrl: './organizer-header.scss',
})
export class OrganizerHeader {
  /** 手機版選單是否展開。 */
  isMenuOpen = false;
  user: MarketDayUser | null = null;
  isLoggingOut = false;

  /** 綁定元件生命週期，避免 Router 事件訂閱造成記憶體洩漏。 */
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alert: AlertService
  ) {
    this.loadOrganizerUser();

    // 路由切換後自動收合選單，避免頁面已切換但選單仍停留在開啟狀態。
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closeMenu());
  }

  get isLoggedIn(): boolean {
    return Boolean(
      this.authService.getToken('organizer') &&
      this.user?.role === 'ORGANIZER'
    );
  }

  get managementUrl(): string {
    return this.authService.getDashboardPath('organizer');
  }

  /** 切換手機版選單開合狀態。 */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /** 關閉手機版選單。 */
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  /** 使用者按下 Escape 時關閉選單。 */
  @HostListener('document:keydown.escape')
  closeMenuOnEscape(): void {
    this.closeMenu();
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut) {
      return;
    }

    const confirmed = await this.alert.confirm(
      '確認登出',
      '確定要登出目前帳號嗎？',
      '確認登出',
      '取消'
    );
    if (!confirmed) {
      return;
    }

    this.isLoggingOut = true;
    this.closeMenu();

    try {
      const response = await firstValueFrom(this.authService.logout('organizer'));
      if (!isApiSuccessStatus(response.statusCode)) {
        await this.alert.warning(
          '登入狀態已清除',
          response.message || '伺服器登出未完成，但本機登入資料已清除。',
          '知道了'
        );
      }
    } catch {
      await this.alert.warning(
        '登入狀態已清除',
        '目前無法連線至伺服器，本機登入資料已清除。',
        '知道了'
      );
    } finally {
      this.authService.clearSession('organizer');
      this.user = null;
      this.isLoggingOut = false;
      await this.router.navigateByUrl('/organizer/home');
    }
  }

  private loadOrganizerUser(): void {
    const user = this.authService.getUser('organizer');
    this.user = user?.role === 'ORGANIZER' ? user : null;
  }
}
