import { Component, Input, OnChanges, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItem, NotificationType } from '../../../models/NotificationItem';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
  selector: 'app-dashboard-notification',
  imports: [CommonModule, Pagination],
  templateUrl: './dashboard-notification.html',
  styleUrl: './dashboard-notification.scss',
})
export class DashboardNotification implements OnChanges, OnInit {
  @Input() tabs: Array<'全部' | '未讀' | NotificationType> = [];

  @Input() notifications: NotificationItem[] = [];

  activeTab: '全部' | '未讀' | NotificationType = '全部';

  currentPage = 1;

  pageSize = 8;

  ngOnInit(): void {
    this.updatePageSize();
  }

  ngOnChanges(): void {
    this.activeTab = '全部';
    this.currentPage = 1;
    this.updatePageSize();
  }

  @HostListener('window:resize')
  updatePageSize(): void {
    const headerHeight = 130;
    const itemHeight = 70;

    const availableHeight = window.innerHeight - headerHeight;
    const newPageSize = Math.max(5, Math.floor(availableHeight / itemHeight));

    this.pageSize = newPageSize;

    const totalPages = Math.ceil(this.filteredNotifications.length / this.pageSize);

    if (this.currentPage > totalPages) {
      this.currentPage = Math.max(1, totalPages);
    }
  }

  get filteredNotifications(): NotificationItem[] {
    if (this.activeTab === '全部') {
      return this.notifications;
    }

    if (this.activeTab === '未讀') {
      return this.notifications.filter((item) => item.unread);
    }

    return this.notifications.filter((item) => item.type === this.activeTab);
  }

  setTab(tab: '全部' | '未讀' | NotificationType): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.updatePageSize();
  }

  markAsRead(item: NotificationItem): void {
    item.unread = false;
  }

  pagedNotifications(): NotificationItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.filteredNotifications.slice(start, end);
  }

  setPage(page: number): void {
    this.currentPage = page;
  }
}