import { Component } from '@angular/core';
import { MenuItem } from '../../../../../models/MenuItem';
import { DashboardSidebar } from '../../dashboard-sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-vendor-dashboard-shell',
  imports: [DashboardSidebar, RouterOutlet],
  templateUrl: './vendor-dashboard-shell.html',
  styleUrl: './vendor-dashboard-shell.scss',
})
export class VendorDashboardShell {
  /** 側邊欄目錄 */
  menuItems: MenuItem[] = [
    {
      label: '首頁',
      icon: 'bi-house-door',
      path: '/vendor/dash-board/home',
    },
    {
      label: '通知中心',
      icon: 'bi-bell',
      path: '/vendor/dash-board/notification',
    },
    {
      label: '我的攤位',
      icon: 'bi-shop',
      path: '/vendor/dash-board/stall',
    },
    {
      label: '我的報名紀錄',
      icon: 'bi-clipboard-check',
      path: '/vendor/dash-board/register-record',
    },
  ];
}
