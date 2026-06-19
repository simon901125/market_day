import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MenuItem } from '../../../models/interface/MenuItem';
import { UserMenuItem } from '../../../models/interface/UserMenuItem';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [DashboardSidebar, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  logoPath = '';
  homePath = '/';

  menuItems: MenuItem[] = [];
  userMenuItems: UserMenuItem[] = [];

  userName = '董映彤';
  userEmail = 'yingtung0808@gmail.com';
  userInitial = '董';

  constructor(private route: ActivatedRoute) {
    const role = this.route.snapshot.data['role'];

    if (role === 'vendor') {
      this.logoPath = '/assets/images/logo/logo-market-day-vendor.png';
      this.homePath = '/vendor/dash-board/home';

      this.menuItems = [
        { label: '首頁', icon: 'bi-house-door', path: '/vendor/dash-board/home' },
        { label: '通知中心', icon: 'bi-bell', path: '/vendor/dash-board/notification' },
        { label: '我的攤位', icon: 'bi-shop', path: '/vendor/dash-board/stall' },
        { label: '我的報名紀錄', icon: 'bi-clipboard-check', path: '/vendor/dash-board/register-record' },
      ];

      this.userMenuItems = [
        { label: '帳號設定', icon: 'bi-person', path: '/vendor/dash-board/account-settings' },
        { label: '登出', icon: 'bi-box-arrow-right', action: 'logout' },
      ];
    }

    if (role === 'organizer') {
      this.logoPath = '/assets/images/logo/logo-market-day-organizer.png';
      this.homePath = '/organizer/dash-board/home';

      this.menuItems = [
        { label: '首頁', icon: 'bi-house-door', path: '/organizer/dash-board/home' },
        { label: '通知中心', icon: 'bi-bell', path: '/organizer/dash-board/notification' },
        { label: '市集管理', icon: 'bi-calendar-event', path: '/organizer/dash-board/activity' },
        { label: '報名管理', icon: 'bi-clipboard-check', path: '/organizer/dash-board/register' },
        { label: '付款管理', icon: 'bi-cash-coin', path: '/organizer/dash-board/payment' },
        { label: '帳務管理', icon: 'bi-receipt', path: '/organizer/dash-board/account' },
      ];

      this.userMenuItems = [
        { label: '主辦資料', icon: 'bi-person', path: '/organizer/dash-board/profile' },
        { label: '帳號設定', icon: 'bi-gear', path: '/organizer/dash-board/account' },
        { label: '登出', icon: 'bi-box-arrow-right', action: 'logout' },
      ];
    }

    if (role === 'admin') {
      this.logoPath = '/assets/images/logo/logo-market-day-administrator.png';
      this.homePath = '/admin/dash-board/home';

      this.menuItems = [
        { label: '首頁', icon: 'bi-house-door', path: '/admin/dash-board/home' },
        { label: '通知中心', icon: 'bi-bell', path: '/admin/dash-board/notification' },
        { label: '市集管理', icon: 'bi-calendar-event', path: '/admin/dash-board/activity' },
        { label: '使用者管理', icon: 'bi-people', path: '/admin/dash-board/users' },
        { label: '系統紀錄', icon: 'bi-clock-history', path: '/admin/dash-board/logs' },
      ];

      this.userMenuItems = [
        { label: '管理員資料', icon: 'bi-person', path: '/admin/dash-board/profile' },
        { label: '帳號設定', icon: 'bi-gear', path: '/admin/dash-board/account' },
        { label: '登出', icon: 'bi-box-arrow-right', action: 'logout' },
      ];
    }
  }
}
