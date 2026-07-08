import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { MarketDayUser } from '../../../../models/interface/shared/Auth';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';

@Component({
  selector: 'app-vendor-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './vendor-header.html',
  styleUrl: './vendor-header.scss',
})
export class VendorHeader {
  isMenuOpen = false;
  user: MarketDayUser | null = null;
  isLoggingOut = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly alert: AlertService
  ) {
    this.loadVendorUser();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.loadVendorUser();
        this.closeMenu();
      });
  }

  get isLoggedIn(): boolean {
    return Boolean(
      this.authService.getToken('vendor') &&
      this.user?.role === 'VENDOR'
    );
  }

  get vendorDashboardUrl(): string {
    return this.authService.getDashboardPath('vendor');
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut) {
      return;
    }

    const confirmed = await this.alert.confirm(
      '確認登出',
      '確定要登出攤主帳號嗎？',
      '確認登出',
      '取消'
    );
    if (!confirmed) {
      return;
    }

    this.isLoggingOut = true;
    this.closeMenu();

    try {
      const response = await firstValueFrom(this.authService.logout('vendor'));
      if (!isApiSuccessStatus(response.statusCode)) {
        await this.alert.warning(
          '登出狀態提醒',
          response.message || '系統已清除本機登入資訊，請重新登入。',
          '知道了'
        );
      }
    } catch {
      await this.alert.warning(
        '登出狀態提醒',
        '目前無法連線到登出 API，系統已先清除本機登入資訊。',
        '知道了'
      );
    } finally {
      this.authService.clearSession('vendor');
      this.user = null;
      this.isLoggingOut = false;
      await this.router.navigateByUrl('/vendor/home');
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  closeMenuOnEscape(): void {
    this.closeMenu();
  }

  private loadVendorUser(): void {
    const user = this.authService.getUser('vendor');
    this.user = user?.role === 'VENDOR' ? user : null;
  }
}
