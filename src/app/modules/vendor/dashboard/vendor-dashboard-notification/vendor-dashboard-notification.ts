import { Component, OnInit } from '@angular/core';
import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { VendorDashboardNotification as VendorNotification } from '../../../../models/interface/vendor/VendorDashboardInit';
import {
  DashboardNotification,
  NotificationItem,
} from '../../../shared/dashboard/dashboard-notification/dashboard-notification';

const TAB_TO_FILTER: Record<string, string> = {
  全部: '全部',
  未讀: '未讀',
  報名通知: '報名審核',
  收款通知: '付款相關',
  攤位通知: '攤位分配',
  活動通知: '活動異動',
  系統通知: '系統通知',
};

@Component({
  selector: 'app-vendor-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './vendor-dashboard-notification.html',
  styleUrl: './vendor-dashboard-notification.scss',
})
export class VendorDashboardNotification implements OnInit {
  /** 標籤 */
  tabs: string[] = [
    '全部',
    '未讀',
    '報名通知',
    '收款通知',
    '攤位通知',
    '活動通知',
    '系統通知',
  ];

  notifications: NotificationItem[] = [];
  totalItems = 0;
  readonly pageSize = 8;
  loading = false;

  private currentFilter = TAB_TO_FILTER['全部'];
  private currentPage = 1;

  constructor(
    private readonly vendorDashboardService: VendorDashboardService,
    private readonly notificationApiService: NotificationApiService,
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  onTabChange(tab: string): void {
    this.currentPage = 1;
    this.currentFilter = TAB_TO_FILTER[tab] ?? TAB_TO_FILTER['全部'];
    this.loadNotifications();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotifications();
  }

  onMarkRead(item: NotificationItem): void {
    if (item.id == null) return;
    this.notificationApiService.markAsRead(item.id, { skipLoading: true }).subscribe();
  }

  private loadNotifications(): void {
    this.loading = true;
    this.vendorDashboardService
      .getVendorNotifications(this.currentFilter, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.loading = false;
          const page = response.data?.notifications;

          if (!isApiSuccessStatus(response.statusCode) || !page) {
            this.notifications = [];
            this.totalItems = 0;
            return;
          }

          this.notifications = (page.items ?? []).map((item) => this.toNotificationItem(item));
          this.totalItems = page.totalItems;
        },
        error: () => {
          this.loading = false;
          this.notifications = [];
          this.totalItems = 0;
        },
      });
  }

  private toNotificationItem(item: VendorNotification): NotificationItem {
    const appearance = this.notificationAppearance(item.category);
    return {
      id: item.id,
      icon: appearance.icon,
      iconClass: appearance.iconClass,
      title: item.content,
      status: item.title,
      date: this.formatDateTime(item.createdAt),
      unread: !item.isRead,
      type: item.category,
    };
  }

  private notificationAppearance(category: string): {
    icon: string;
    iconClass: string;
  } {
    switch (category) {
      case 'PAYMENT':
        return { icon: 'bi bi-wallet2', iconClass: 'blue' };
      case 'STALL_ASSIGNMENT':
        return { icon: 'bi bi-shop', iconClass: 'green' };
      case 'EVENT_CHANGE':
        return { icon: 'bi bi-megaphone', iconClass: 'purple' };
      case 'SYSTEM':
        return { icon: 'bi bi-info-circle', iconClass: 'blue' };
      default:
        return { icon: 'bi bi-clipboard-check', iconClass: 'orange' };
    }
  }

  private formatDateTime(value: string): string {
    return value ? value.replace('T', ' ').slice(0, 16).replaceAll('-', '/') : '';
  }
}
