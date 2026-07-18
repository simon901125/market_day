import { Component } from '@angular/core';
import type { NotificationItem, NotificationType } from '../../../../models/interface/shared/NotificationItem';
import { NotificationStatus } from '../../../../models/status/NotificationStatus';
import { AdminDashboardNotice } from '../../../../models/interface/admin/AdminDashboardOverview';
import { DashboardNotification } from '../../../shared/dashboard/dashboard-notification/dashboard-notification';
import { getNoticeStatusClass, getNoticeTypeDisplay } from '../../../shared/dashboard/dashboard-notification/notice-type-display';

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
    '活動',
    '系統',
    '異常',
  ];

  notifications: NotificationItem[] = [];

  /**
   * 把 API 回傳的通知中心資料（AdminDashboardNotice）轉成畫面用的 NotificationItem
   */
  protected mapNotices(notices: AdminDashboardNotice[]): NotificationItem[] {
    return notices.map((notice) => {
      const display = getNoticeTypeDisplay(notice.type);

      return {
        icon: display.icon,
        iconClass: display.iconClass,
        title: notice.title,
        status: display.status,
        statusClass: getNoticeStatusClass(display.iconClass),
        date: notice.time,
        unread: !notice.isRead,
        type: notice.type,
      };
    });
  }
}
