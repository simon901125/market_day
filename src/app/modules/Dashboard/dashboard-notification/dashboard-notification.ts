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
}

@Component({
  selector: 'app-dashboard-notification',
  imports: [CommonModule, RouterLink, DashboardPagination],
  templateUrl: './dashboard-notification.html',
  styleUrl: './dashboard-notification.scss',
})
export class DashboardNotification {
  /**
   * 通知區塊標題
   */
  @Input() title = '通知中心';

  /**
   * 通知分類 Tab
   */
  @Input() tabs: string[] = ['全部', '未讀', '已讀'];

  /**
   * 通知資料列表
   */
  @Input() notifications: NotificationItem[] = [];

  /**
   * 首頁最新通知最大顯示筆數
   */
  @Input() maxItems = 10;

  /**
   * 是否限制顯示筆數
   *
   * 首頁最新通知：true
   * 通知中心：false
   */
  @Input() limitItems = false;

  /**
   * 是否顯示分類 Tab
   */
  @Input() showTabs = true;

  /**
   * 是否顯示分頁
   *
   * 通知中心：true
   * 首頁最新通知：false
   */
  @Input() showPagination = true;

  /**
   * 查看全部連結
   */
  @Input() viewAllLink = '';

  /**
   * 目前選中的 Tab
   */
  activeTab = '全部';

  /**
   * 目前頁碼
   */
  currentPage = 1;

  /**
   * 通知中心每頁顯示筆數
   */
  pageSize = 8;

  /**
   * 依照目前選擇的 Tab 篩選通知資料
   */
  get filteredNotifications(): NotificationItem[] {
    if (this.activeTab === '未讀') {
      return this.notifications.filter((item) => item.unread);
    }

    if (this.activeTab === '已讀') {
      return this.notifications.filter((item) => !item.unread);
    }

    return this.notifications;
  }

  /**
   * 取得目前畫面要顯示的通知資料
   *
   * 首頁最新通知：
   * - limitItems = true
   * - 不使用分頁
   * - 依 maxItems 顯示目前畫面可容納的筆數
   *
   * 通知中心：
   * - limitItems = false
   * - showPagination = true
   * - 使用 currentPage 和 pageSize 做分頁
   */
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

  /**
   * 切換通知分類 Tab
   *
   * @param tab 選擇的分類名稱
   */
  setTab(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  /**
   * 切換通知頁碼
   *
   * @param page 目標頁碼
   */
  setPage(page: number): void {
    this.currentPage = page;
  }

  /**
   * 將通知標記為已讀
   *
   * @param item 點擊的通知資料
   */
  markAsRead(item: NotificationItem): void {
    item.unread = false;
  }
}