import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItem, NotificationType } from '../../../models/NotificationItem';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
  selector: 'app-dashboard-notification',
  imports: [CommonModule, Pagination],
  templateUrl: './dashboard-notification.html',
  styleUrl: './dashboard-notification.scss',
})
export class DashboardNotification implements OnChanges {
  /** 通知分類 */
  @Input() tabs: Array<'全部' | '未讀' | NotificationType> = [];

  /** 通知資料 */
  @Input() notifications: NotificationItem[] = [];

  /** 目前選中的分類 */
  activeTab: '全部' | '未讀' | NotificationType = '全部';

  /** 當前頁碼 */
  currentPage = 1;

  /** 每頁顯示數量 */
  pageSize = 8;

  /** 當外部通知資料改變時，重置分類與頁碼 */
  ngOnChanges(): void {
    this.activeTab = '全部';
    this.currentPage = 1;
  }

  /** 過濾通知 */
  get filteredNotifications(): NotificationItem[] {
    if (this.activeTab === '全部') {
      return this.notifications;
    }

    if (this.activeTab === '未讀') {
      return this.notifications.filter((item) => item.unread);
    }

    return this.notifications.filter((item) => item.type === this.activeTab);
  }

  /** 切換分類 */
  setTab(tab: '全部' | '未讀' | NotificationType): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  /** 點擊單筆通知後標記為已讀 */
  markAsRead(item: NotificationItem): void {
    item.unread = false;
  }

  /** 目前頁面的通知 */
  pagedNotifications(): NotificationItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.filteredNotifications.slice(start, end);
  }

  /** 切換頁碼 */
  setPage(page: number): void {
    this.currentPage = page;
  }
}