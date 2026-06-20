import { Component } from '@angular/core';
import type { NotificationItem, NotificationType } from '../../../../models/interface/NotificationItem';
import { NotificationStatus } from '../../../../models/status/NotificationStatus';
import { DashboardNotification } from '../../../shared/dashboard/dashboard-notification/dashboard-notification';

@Component({
  selector: 'app-admin-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './admin-dashboard-notification.html',
  styleUrl: './admin-dashboard-notification.scss',
})
export class AdminDashboardNotification {
  tabs: Array<typeof NotificationStatus.all | typeof NotificationStatus.unread | NotificationType> = [
    NotificationStatus.all,
    NotificationStatus.unread,
    '主辦方',
    '活動',
    '系統',
    '異常',
  ];

  notifications: NotificationItem[] = [
    {
      icon: 'bi bi-person-badge',
      iconClass: 'orange',
      title: '主辦方「森林生活市集」申請加入平台',
      status: '新申請',
      statusClass: 'pending',
      date: '2026/06/02 14:30',
      unread: true,
      type: '主辦方',
    },
    {
      icon: 'bi bi-wallet2',
      iconClass: 'blue',
      title: '主辦方「日日好市」已重新送出資料',
      status: '補件完成',
      statusClass: 'success',
      date: '2026/06/02 13:10',
      unread: true,
      type: '主辦方',
    },
    {
      icon: 'bi bi-calendar-check',
      iconClass: 'green',
      title: '主辦方建立活動：夏日綠意市集',
      status: '新活動',
      statusClass: 'info',
      date: '2026/06/02 11:45',
      unread: true,
      type: '活動',
    },
    {
      icon: 'bi bi-exclamation-triangle',
      iconClass: 'red',
      title: '帳號「user_***@gmail.com」登入異常次數過高',
      status: '異常提醒',
      statusClass: 'cancel',
      date: '2026/06/02 10:15',
      unread: false,
      type: '異常',
    },
    {
      icon: 'bi bi-megaphone',
      iconClass: 'purple',
      title: '系統將於 06/10（二）00:00 - 02:00 進行維護',
      status: '系統公告',
      statusClass: 'info',
      date: '2026/06/01 16:20',
      unread: false,
      type: '系統',
    },
    {
      icon: 'bi bi-person-badge',
      iconClass: 'orange',
      title: '主辦方「春光小日子」申請加入平台',
      status: '新申請',
      statusClass: 'pending',
      date: '2026/06/01 15:05',
      unread: false,
      type: '主辦方',
    },
    {
      icon: 'bi bi-flag',
      iconClass: 'green',
      title: '活動「週末河畔市集」審核已通過',
      status: '活動通過',
      statusClass: 'success',
      date: '2026/05/30 09:30',
      unread: false,
      type: '活動',
    },
    {
      icon: 'bi bi-shield-check',
      iconClass: 'blue',
      title: '平台安全設定已完成更新',
      status: '系統更新',
      statusClass: 'info',
      date: '2026/05/29 08:40',
      unread: false,
      type: '系統',
    },
  ];
}
