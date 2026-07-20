import { Component, inject, type OnInit } from '@angular/core';
import { AlertService } from '../../../../core/services/alert.service';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import {
  OrganizerNotificationFilter,
  OrganizerNotificationItem,
} from '../../../../models/interface/organizer/OrganizerNotification';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { NotificationTypeDisplay } from '../../../../models/type/NotificationTypeDisplay';
import {
  DashboardNotification,
  NotificationItem,
} from '../../../shared/dashboard/dashboard-notification/dashboard-notification';

@Component({
  selector: 'app-organizer-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './organizer-dashboard-notification.html',
  styleUrl: './organizer-dashboard-notification.scss',
})
/** 主辦方通知中心，負責分類查詢、分頁顯示及通知已讀狀態。 */
export class OrganizerDashboardNotification implements OnInit {
  protected readonly organizerNotificationApi = inject(OrganizerApiService);
  protected readonly notificationApi = inject(NotificationApiService);
  protected readonly alert = inject(AlertService);

  /** 通知中心分類頁籤。 */
  readonly tabs: OrganizerNotificationFilter[] = [
    '全部',
    '未讀',
    '報名相關',
    '付款相關',
    '活動異動',
    '系統公告',
  ];

  notifications: NotificationItem[] = [];
  totalItems = 0;
  unreadCount = 0;
  pageSize = 8;
  loading = false;

  protected currentPage = 1;
  protected currentFilter: OrganizerNotificationFilter = '全部';

  /** 進入通知中心時載入第一頁通知。 */
  ngOnInit(): void {
    this.loadNotifications();
  }

  onTabChange(tab: string): void {
    this.currentFilter = this.isOrganizerFilter(tab) ? tab : '全部';
    this.currentPage = 1;
    this.loadNotifications();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotifications();
  }

  /** 依目前分類與頁碼查詢通知，並同步未讀數與分頁資訊。 */
  protected loadNotifications(requestPageSize = this.pageSize): void {
    this.loading = true;
    this.organizerNotificationApi.getOrganizerNotifications({
      filter: this.currentFilter,
      page: this.currentPage,
      pageSize: requestPageSize,
    }).subscribe({
      next: async (response) => {
        this.loading = false;
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          await this.alert.error('讀取失敗', response.message || '無法取得通知資料。');
          return;
        }

        this.notifications = response.data.notifications.items.map((item) =>
          this.toNotificationItem(item),
        );
        this.totalItems = response.data.notifications.totalItems;
        this.unreadCount = response.data.unreadCount;
      },
      error: async (error) => {
        this.loading = false;
        await this.alert.error('讀取失敗', error.error?.message || '請稍後再試。');
      },
    });
  }

  /** 將單筆通知標記已讀；失敗時還原畫面的未讀狀態。 */
  onMarkRead(item: NotificationItem): void {
    if (item.id == null) return;

    this.notificationApi.markAsRead(item.id, { skipLoading: true }).subscribe({
      next: async (response) => {
        if (!isApiSuccessStatus(response.statusCode)) {
          item.unread = true;
          await this.alert.error('標記已讀失敗', response.message);
          return;
        }

        this.unreadCount = Math.max(0, this.unreadCount - 1);
        if (this.currentFilter === '未讀') {
          this.loadNotifications();
        }
      },
      error: async (error) => {
        item.unread = true;
        await this.alert.error('標記已讀失敗', error.error?.message || '請稍後再試。');
      },
    });
  }

  /** 將後端通知轉為共用通知元件所需的顯示模型。 */
  protected toNotificationItem(item: OrganizerNotificationItem): NotificationItem {
    const type = this.normalizeType(item.type);
    const display = NotificationTypeDisplay.getDisplay(type);
    return {
      id: item.id,
      icon: display.icon,
      iconClass: display.iconClass,
      status: display.status,
      title: item.content?.trim() || item.title,
      date: this.formatDate(item.createdAt),
      unread: !item.isRead,
      type,
    };
  }

  private normalizeType(type: string): string {
    if (!type.includes('_')) return type;
    return type
      .toLowerCase()
      .replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());
  }

  private formatDate(value: string): string {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    return match
      ? `${match[1]}/${match[2]}/${match[3]} ${match[4]}:${match[5]}`
      : value || '-';
  }

  private isOrganizerFilter(value: string): value is OrganizerNotificationFilter {
    return this.tabs.includes(value as OrganizerNotificationFilter);
  }
}
