import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { VendorDashboardNotification } from '../../../../models/interface/vendor/VendorDashboardInit';
import { DashboardHomeTodoCard } from '../../../shared/dashboard/dashboard-home-todo-card/dashboard-home-todo-card';
import {
  DashboardNotification,
  NotificationItem,
} from '../../../shared/dashboard/dashboard-notification/dashboard-notification';
import { LoadingSpinner } from '../../../shared/loading-spinner/loading-spinner';

interface VendorHomeCard {
  icon: string;
  count: number;
  unit: string;
  label: string;
  path?: string;
  iconColor?: string;
}

@Component({
  selector: 'app-vendor-dashboard-home',
  imports: [RouterLink, DashboardHomeTodoCard, DashboardNotification, LoadingSpinner],
  templateUrl: './vendor-dashboard-home.html',
  styleUrl: './vendor-dashboard-home.scss',
})
export class VendorDashboardHome implements OnInit {
  hasRecords: boolean | null = null;
  loadError = '';
  guideMessage = '';
  todoItems: VendorHomeCard[] = [];
  notifications: NotificationItem[] = [];

  readonly homeNotificationMaxItems = 6;
  private dashboardVendorName = '';

  constructor(
    private readonly authService: AuthService,
    private readonly vendorDashboardService: VendorDashboardService,
  ) {}

  ngOnInit(): void {
    this.hasRecords = null;
    this.loadError = '';

    this.vendorDashboardService.getVendorFirstLogin().subscribe({
      next: (response) => {
        const dashboard = response.data;
        if (!isApiSuccessStatus(response.statusCode) || !dashboard) {
          this.loadError = response.message || '首頁資料載入失敗，請稍後再試。';
          return;
        }

        this.hasRecords = !dashboard.needsProfile;
        this.guideMessage = dashboard.guideMessage ?? '';
        this.dashboardVendorName = dashboard.name?.trim() ?? '';
        this.todoItems = [
          {
            icon: 'bi-clipboard-check',
            count: dashboard.pendingReviewCount,
            unit: '筆',
            label: '待審核報名',
            path: '/vendor/dash-board/application-record',
            iconColor: 'orange',
          },
          {
            icon: 'bi-wallet2',
            count: dashboard.pendingPaymentCount,
            unit: '筆',
            label: '待付款報名',
            path: '/vendor/dash-board/application-record',
            iconColor: 'orange',
          },
          {
            icon: 'bi-shop',
            count: dashboard.pendingStallSelectionCount,
            unit: '筆',
            label: '待選擇攤位',
            path: '/vendor/dash-board/application-record',
            iconColor: 'blue',
          },
          {
            icon: 'bi-arrow-counterclockwise',
            count: 1,
            unit: '筆',
            label: '退款處理中',
            path: '/vendor/dash-board/application-record',
            iconColor: 'purple',
          },
        ];
        this.notifications = (dashboard.notifications ?? [])
          .map((item) => this.toNotificationItem(item));
      },
      error: () => {
        this.loadError = '首頁資料載入失敗，請重新整理後再試。';
      },
    });
  }

  get vendorName(): string {
    return this.dashboardVendorName
      || this.authService.getUser('vendor')?.name?.trim()
      || '攤主';
  }

  private toNotificationItem(item: VendorDashboardNotification): NotificationItem {
    const appearance = this.notificationAppearance(item.category);
    return {
      status: item.title,
      title: item.content,
      date: this.formatDateTime(item.createdAt),
      icon: appearance.icon,
      iconClass: appearance.iconClass,
      unread: !item.isRead,
      type: item.category,
    };
  }

  private notificationAppearance(category: string): { icon: string; iconClass: string } {
    switch (category) {
      case 'PAYMENT':
        return { icon: 'bi bi-wallet2', iconClass: 'blue' };
      case 'STALL_ASSIGNMENT':
        return { icon: 'bi bi-shop', iconClass: 'green' };
      case 'EVENT_CHANGE':
        return { icon: 'bi bi-calendar-event', iconClass: 'purple' };
      case 'SYSTEM':
        return { icon: 'bi bi-info-circle', iconClass: 'blue' };
      case 'EXCEPTION':
        return { icon: 'bi bi-exclamation-triangle', iconClass: 'red' };
      default:
        return { icon: 'bi bi-clipboard-check', iconClass: 'orange' };
    }
  }

  private formatDateTime(value: string): string {
    return value ? value.replace('T', ' ').slice(0, 16).replaceAll('-', '/') : '';
  }
}
