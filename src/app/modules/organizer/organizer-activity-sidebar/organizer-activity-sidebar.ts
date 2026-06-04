import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../../models/MenuItem';
@Component({
  selector: 'app-organizer-activity-sidebar',
  imports: [RouterModule],
  templateUrl: './organizer-activity-sidebar.html',
  styleUrl: './organizer-activity-sidebar.scss',
})
export class OrganizerActivitySidebar {
  menuItems: MenuItem[] = [
    { label: '首頁', icon: 'bi-house-fill', path: '/organizer/activity/home' },
    /**badge >> 訊息數 */
    { label: '通知中心', icon: 'bi-bell', path: '/organizer/activity/notification', badge: 8 },
    { label: '活動管理', icon: 'bi-calendar2-check', path: '/organizer/activity-manage' },
    { label: '報名管理', icon: 'bi-person', path: '/organizer/activity/register-manage' },
    { label: '收款管理', icon: 'bi-cash-coin', path: '/organizer/activity/payment-manage' },
    { label: '攤位管理', icon: 'bi-shop', path: '/organizer/activity/booth-manage' },
  ];
}
