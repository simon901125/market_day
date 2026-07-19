import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardPagination } from '../dashboard-pagination/dashboard-pagination';

export interface NotificationItem {
  /** 通知 id，標記已讀時需要 */
  id?: number;
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

  /**
   * 是否由外部（父元件）控制分頁與篩選
   *
   * true 時代表 `notifications` 已經是後端依 tab、分頁篩選好的當頁資料，
   * 這裡不再自己做 filter / slice，並改用 `totalItems` 顯示總筆數
   */
  @Input() serverMode = false;

  /** serverMode 為 true 時，後端回傳的符合條件總筆數 */
  @Input() totalItems = 0;

  /**
   * serverMode 下換頁、切 tab 時是否正在向後端要新的一頁資料
   *
   * 只讓清單淡化、不整頁蓋上 Loading，避免快速換頁時畫面閃爍
   */
  @Input() loading = false;

  /** 切換 tab 時觸發，serverMode 下父元件需依此重新呼叫 API */
  @Output() tabChange = new EventEmitter<string>();

  /** 換頁時觸發，serverMode 下父元件需依此重新呼叫 API */
  @Output() pageChange = new EventEmitter<number>();

  /** 把未讀通知標記為已讀時觸發（僅在該筆原本是未讀時才會觸發），父元件可依此呼叫標記已讀 API */
  @Output() markRead = new EventEmitter<NotificationItem>();

  activeTab = '全部';
  currentPage = 1;
  /** 通知中心預設並可明確指定每頁 8 筆。 */
  @Input() pageSize = 8;

  get filteredNotifications(): NotificationItem[] {
    if (this.serverMode) {
      return this.notifications;
    }

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

  get pageTotalItems(): number {
    return this.serverMode ? this.totalItems : this.filteredNotifications.length;
  }

  pagedNotifications(): NotificationItem[] {
    if (this.serverMode) {
      return this.notifications;
    }

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
    this.tabChange.emit(tab);
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.pageChange.emit(page);
  }

  markAsRead(item: NotificationItem): void {
    if (!item.unread) return;

    item.unread = false;
    this.markRead.emit(item);
  }
}
