import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { AuthPortalRole } from '../../../../models/interface/shared/Auth';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { MenuItem } from '../../../../models/interface/shared/MenuItem';
import { UserMenuItem } from '../../../../models/interface/shared/UserMenuItem';
import { OrganizerAccountSettings } from '../../../organizer/dashboard/organizer-account-settings/organizer-account-settings';
import { OrganizerProfileModal } from '../../../organizer/dashboard/modals/organizer-profile-modal/organizer-profile-modal';
import { VendorAccountSettings } from '../../../vendor/dashboard/vendor-account-settings/vendor-account-settings';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [DashboardSidebar, RouterOutlet, VendorAccountSettings, OrganizerAccountSettings, OrganizerProfileModal],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  logoPath = '';
  homePath = '/';
  isSidebarCollapsed = false;

  menuItems: MenuItem[] = [];
  userMenuItems: UserMenuItem[] = [];

  userName = '使用者';
  userEmail = '';
  userInitial = '使';
  role: AuthPortalRole = 'vendor';
  isLoggingOut = false;
  isAccountSettingsOpen = false;
  isOrganizerProfileOpen = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alert: AlertService
  ) {
    const routeRole = this.route.snapshot.data['role'];
    if (this.authService.isPortalRole(routeRole)) {
      this.role = routeRole;
    }

    this.loadUserInfo();
    this.setupDashboardByRole();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut) {
      return;
    }

    const confirmed = await this.alert.confirm(
      '是否登出',
      '登出後將返回登入畫面。',
      '確認登出',
      '取消',
    );
    if (!confirmed) {
      return;
    }

    this.isLoggingOut = true;

    try {
      const response = await firstValueFrom(this.authService.logout(this.role));
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
      this.authService.clearSession(this.role);
      this.isLoggingOut = false;
      await this.router.navigateByUrl(this.authService.getLoginPath(this.role));
    }
  }

  openAccountSettings(): void {
    if (this.role === 'admin') {
      return;
    }

    this.isAccountSettingsOpen = true;
  }

  closeAccountSettings(): void {
    this.isAccountSettingsOpen = false;
  }

  openOrganizerProfile(): void {
    if (this.role !== 'organizer') {
      return;
    }

    this.isOrganizerProfileOpen = true;
  }

  closeOrganizerProfile(): void {
    this.isOrganizerProfileOpen = false;
  }

  async saveOrganizerProfile(): Promise<void> {
    await this.alert.success('主辦方資料已儲存', '資料已更新。');
  }

  /** 取得使用者資訊 */
  private loadUserInfo(): void {
    const user = this.authService.getUser(this.role);
    if (!user) {
      return;
    }

    const name = user.name?.trim() || '使用者';
    this.userName = name;
    this.userEmail = user.email || '';
    this.userInitial = name.charAt(0) || '使';
  }

  private setupDashboardByRole(): void {
    if (this.role === 'vendor') {
      this.setupVendorDashboard();
      return;
    }

    if (this.role === 'organizer') {
      this.setupOrganizerDashboard();
      return;
    }

    this.setupAdminDashboard();
  }

  private setupVendorDashboard(): void {
    this.logoPath = '/assets/images/logo/logo-market-day-vendor.png';
    this.homePath = '/vendor/dash-board/home';

    this.menuItems = [
      { label: '首頁', icon: 'bi-house-door', path: '/vendor/dash-board/home' },
      { label: '通知中心', icon: 'bi-bell', path: '/vendor/dash-board/notification' },
      { label: '我的攤位', icon: 'bi-shop', path: '/vendor/dash-board/myStall' },
      {
        label: '我的報名紀錄',
        icon: 'bi-clipboard-check',
        path: '/vendor/dash-board/application-record',
      },
    ];

    this.userMenuItems = [
      { label: '帳號設定', icon: 'bi-person', action: 'account-settings' },
      { label: '登出', icon: 'bi-box-arrow-right', action: 'logout' },
    ];
  }

  private setupOrganizerDashboard(): void {
    this.logoPath = '/assets/images/logo/logo-market-day-organizer.png';
    this.homePath = '/organizer/dash-board/home';

    this.menuItems = [
      { label: '首頁', icon: 'bi-house-door', path: '/organizer/dash-board/home' },
      { label: '通知中心', icon: 'bi-bell', path: '/organizer/dash-board/notification' },
      { label: '活動管理', icon: 'bi-calendar-event', path: '/organizer/dash-board/activity' },
      { label: '報名管理', icon: 'bi-clipboard-check', path: '/organizer/dash-board/register' },
      { label: '收款管理', icon: 'bi-cash-coin', path: '/organizer/dash-board/collection' },
      { label: '攤位管理', icon: 'bi-shop', path: '/organizer/dash-board/stall' },
      { label: '設備管理', icon: 'bi-box-seam', path: '/organizer/dash-board/equipment' },
      { label: '帳務管理', icon: 'bi-receipt', path: '/organizer/dash-board/account' },
    ];

    this.userMenuItems = [
      { label: '主辦方資料', icon: 'bi-person', action: 'organizer-profile' },
      { label: '帳號設定', icon: 'bi-gear', action: 'account-settings' },
      { label: '登出', icon: 'bi-box-arrow-right', action: 'logout' },
    ];
  }

  private setupAdminDashboard(): void {
    this.logoPath = '/assets/images/logo/logo-market-day-administrator.png';
    this.homePath = '/admin/dash-board/home';

    this.menuItems = [
      { label: '首頁', icon: 'bi-house-door', path: '/admin/dash-board/home' },
      { label: '通知中心', icon: 'bi-bell', path: '/admin/dash-board/notification' },
      { label: '活動管理', icon: 'bi-calendar-event', path: '/admin/dash-board/activity' },
      { label: '使用者管理', icon: 'bi-people', path: '/admin/dash-board/users' },
      { label: '操作紀錄', icon: 'bi-clock-history', path: '/admin/dash-board/logs' },
    ];

    this.userMenuItems = [
      { label: '登出', icon: 'bi-box-arrow-right', action: 'logout' },
    ];
  }
}
