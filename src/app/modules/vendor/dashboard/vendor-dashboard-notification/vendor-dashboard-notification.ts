import { Component, OnInit } from '@angular/core';

import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { AlertService } from '../../../../core/services/alert.service';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { VendorDashboardNotification as VendorNotificationApiItem } from '../../../../models/interface/vendor/VendorDashboardInit';
import { VendorNotificationFilter } from '../../../../models/interface/vendor/VendorNotification';
import { NotificationTypeDisplay } from '../../../../models/type/NotificationTypeDisplay';
import {
  DashboardNotification,
  NotificationItem,
} from '../../../shared/dashboard/dashboard-notification/dashboard-notification';

@Component({
  selector: 'app-vendor-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './vendor-dashboard-notification.html',
  styleUrl: './vendor-dashboard-notification.scss',
})
export class VendorDashboardNotification implements OnInit {
  readonly tabs: VendorNotificationFilter[] = [
    '全部',
    '未讀',
    '報名審核',
    '付款相關',
    '攤位分配',
    '活動異動',
    '系統通知',
  ];

  notifications: NotificationItem[] = [];
  totalItems = 0;
  unreadCount = 0;
  readonly pageSize = 8;
  loading = false;

  private currentPage = 1;
  private currentFilter: VendorNotificationFilter = '全部';

  constructor(
    private readonly vendorDashboardService: VendorDashboardService,
    private readonly notificationApi: NotificationApiService,
    private readonly alert: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  onTabChange(tab: string): void {
    this.currentFilter = this.isVendorFilter(tab) ? tab : '全部';
    this.currentPage = 1;
    this.loadNotifications();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotifications();
  }

  onMarkRead(item: NotificationItem): void {
    if (item.id == null) return;

    this.notificationApi.markAsRead(item.id, { skipLoading: true }).subscribe({
      next: async (response) => {
        if (!isApiSuccessStatus(response.statusCode)) {
          item.unread = true;
          await this.alert.error('標記已讀失敗', response.message || '請稍後再試。');
          return;
        }

        this.unreadCount = Math.max(0, this.unreadCount - 1);
        if (this.currentFilter === '未讀') this.loadNotifications();
      },
      error: async (error) => {
        item.unread = true;
        await this.alert.error('標記已讀失敗', error.error?.message || '請稍後再試。');
      },
    });
  }

  private loadNotifications(): void {
    this.loading = true;
    this.vendorDashboardService.getVendorNotifications({
      filter: this.currentFilter,
      page: this.currentPage,
      pageSize: this.pageSize,
    }).subscribe({
      next: async (response) => {
        this.loading = false;
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          this.notifications = [];
          this.totalItems = 0;
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
        this.notifications = [];
        this.totalItems = 0;
        await this.alert.error('讀取失敗', error.error?.message || '請稍後再試。');
      },
    });
  }

  private toNotificationItem(item: VendorNotificationApiItem): NotificationItem {
    const type = this.normalizeType(item.type);
    const display = NotificationTypeDisplay.getDisplay(type);
    return {
      id: item.id,
      icon: display.icon,
      iconClass: display.iconClass,
      status: display.status,
      title: item.content?.trim() || item.title,
      date: this.formatDateTime(item.createdAt),
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

  private formatDateTime(value: string): string {
    return value ? value.replace('T', ' ').slice(0, 16).replaceAll('-', '/') : '-';
  }

  private isVendorFilter(value: string): value is VendorNotificationFilter {
    return this.tabs.includes(value as VendorNotificationFilter);
  }
}
