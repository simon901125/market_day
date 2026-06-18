import { Component, Input, OnChanges, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItem, NotificationType } from '../../../models/NotificationItem';
import { NotificationStatus } from '../../../models/status/NotificationStatus';
import { DashboardPagination } from '../dashboard-pagination/dashboard-pagination';

/** 通知頁籤類型 */
type NotificationTab =
  | typeof NotificationStatus.all
  | typeof NotificationStatus.unread
  | NotificationType;

@Component({
  selector: 'app-dashboard-notification',
  imports: [CommonModule, DashboardPagination],
  templateUrl: './dashboard-notification.html',
  styleUrl: './dashboard-notification.scss',
})
export class DashboardNotification implements OnChanges, OnInit {
  /** 通知分類頁籤 */
  @Input() tabs: NotificationTab[] = [];

  /** 通知資料 */
  @Input() notifications: NotificationItem[] = [];

  /** 目前選中的分類 */
  activeTab: NotificationTab = NotificationStatus.all;

  /** 當前頁碼 */
  currentPage = 1;

  /** 每頁顯示數量 */
  pageSize = 8;

  /** 初始化時計算每頁顯示筆數 */
  ngOnInit(): void {
    this.updatePageSize();
  }

  /** 外部資料改變時，重置分類與頁碼 */
  ngOnChanges(): void {
    this.activeTab = NotificationStatus.all;
    this.currentPage = 1;
    this.updatePageSize();
  }

  /** 依照視窗高度自動調整每頁筆數 */
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

  /** 依照目前分類過濾通知 */
  get filteredNotifications(): NotificationItem[] {
    if (this.activeTab === NotificationStatus.all) {
      return this.notifications;
    }

    if (this.activeTab === NotificationStatus.unread) {
      return this.notifications.filter((item) => item.unread);
    }

    return this.notifications.filter((item) => item.type === this.activeTab);
  }

  /** 切換通知分類 */
  setTab(tab: NotificationTab): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.updatePageSize();
  }

  /** 點擊通知後標記為已讀 */
  markAsRead(item: NotificationItem): void {
    item.unread = false;
  }

  /** 取得目前頁面的通知資料 */
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