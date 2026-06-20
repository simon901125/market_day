import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardPagination } from '../dashboard-pagination/dashboard-pagination';

export interface NotificationItem {
  status: string;
  title: string;
  date: string;
  icon: string;
  iconClass?: string;
  unread?: boolean;
  type?: string;
}

@Component({
  selector: 'app-dashboard-notification',
  imports: [CommonModule, RouterLink, DashboardPagination],
  templateUrl: './dashboard-notification.html',
  styleUrl: './dashboard-notification.scss',
})
export class DashboardNotification {
  @Input() title = '通知中心';
  @Input() tabs: string[] = ['全部', '未讀', '已讀'];
  @Input() notifications: NotificationItem[] = [];
  @Input() maxItems = 10;
  @Input() limitItems = false;
  @Input() showTabs = true;
  @Input() showPagination = true;
  @Input() viewAllLink = '';
  @Input() viewAllText = '查看全部';

  activeTab = '全部';
  currentPage = 1;
  pageSize = 8;

  get filteredNotifications(): NotificationItem[] {
    if (this.activeTab === '未讀') {
      return this.notifications.filter((item) => item.unread);
    }

    if (this.activeTab === '已讀') {
      return this.notifications.filter((item) => !item.unread);
    }

    if (this.activeTab === '全部') {
      return this.notifications;
    }

    return this.notifications.filter((item) => item.type === this.activeTab);
  }

  pagedNotifications(): NotificationItem[] {
    if (this.limitItems) {
      return this.filteredNotifications.slice(0, this.maxItems);
    }

    if (this.showPagination) {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredNotifications.slice(start, start + this.pageSize);
    }

    return this.filteredNotifications;
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  markAsRead(item: NotificationItem): void {
    item.unread = false;
  }
}
