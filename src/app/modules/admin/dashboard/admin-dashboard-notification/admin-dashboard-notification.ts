import { Component, OnInit } from '@angular/core';
import type { NotificationItem } from '../../../../models/interface/shared/NotificationItem';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { NotificationStatus } from '../../../../models/status/NotificationStatus';
import { AdminDashboardNotice } from '../../../../models/interface/admin/AdminDashboardOverview';
import { AdminNoticeSearchRequest } from '../../../../models/interface/admin/AdminNoticeSearch';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { AlertService } from '../../../../core/services/alert.service';
import { DashboardNotification } from '../../../shared/dashboard/dashboard-notification/dashboard-notification';
import { getNoticeStatusClass, getNoticeTypeDisplay } from '../../../shared/dashboard/dashboard-notification/notice-type-display';
import { NotificationCategory } from '../../../shared/dashboard/dashboard-notification/notification-category';

/** 通知分類 tab 對應的後端 NotificationCategory（管理員只使用活動異動、系統、異常三種分類） */
const TAB_TO_CATEGORY: Record<string, NotificationCategory> = {
  活動: 'eventChange',
  系統: 'system',
  異常: 'exception',
};

@Component({
  selector: 'app-admin-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './admin-dashboard-notification.html',
  styleUrl: './admin-dashboard-notification.scss',
})
export class AdminDashboardNotification implements OnInit {
  tabs: string[] = [NotificationStatus.all, NotificationStatus.unread, '活動', '系統', '異常'];

  notifications: NotificationItem[] = [];
  totalItems = 0;
  pageSize = 8;
  loading = false;

  private currentPage = 1;
  private currentCategory: NotificationCategory | null = null;
  private isOnlyUnread: boolean | null = null;

  constructor(
    protected readonly adminApiService: AdminApiService,
    protected readonly alert: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadNotices();
  }

  /**
   * 切換 tab 時：重新從第一頁查詢，未讀 tab 帶 isOnlyUnread，分類 tab 帶對應 category
   */
  onTabChange(tab: string): void {
    this.currentPage = 1;
    this.isOnlyUnread = tab === NotificationStatus.unread ? true : null;
    this.currentCategory = TAB_TO_CATEGORY[tab] ?? null;
    this.loadNotices();
  }

  /**
   * 換頁時：保留目前的 tab 篩選條件，重新查詢指定頁碼
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotices();
  }

  /**
   * 串接 API："/api/admin/notices/search"，依目前 tab 與頁碼查詢通知中心列表
   *
   * 換頁、切 tab 屬於頻繁的區域性操作，改用 skipLoading 跳過全螢幕 Loading，
   * 只讓清單本身淡化提示載入中，避免快速切換時整個畫面閃爍
   */
  private loadNotices(): void {
    const request: AdminNoticeSearchRequest = {
      isOnlyUnread: this.isOnlyUnread,
      category: this.currentCategory,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
    };

    this.loading = true;
    this.adminApiService.searchNotices(request, { skipLoading: true }).subscribe({
      next: async (res) => {
        this.loading = false;

        if (!isApiSuccessStatus(res.statusCode)) {
          await this.alert.error('讀取失敗', res.message);
          return;
        }

        this.notifications = this.mapNotices(res.data.items);
        this.totalItems = res.data.totalItems;
      },
      error: async (error) => {
        this.loading = false;
        await this.alert.error('讀取失敗', error.error?.message || '請稍後再試。');
      },
    });
  }

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
