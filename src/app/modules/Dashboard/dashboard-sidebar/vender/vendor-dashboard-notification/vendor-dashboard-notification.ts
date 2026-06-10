import { Component } from '@angular/core';
import { NotificationType } from '../../../../../models/NotificationItem';
import { NotificationItem } from '../../../../../models/NotificationItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-vendor-dashboard-notification',
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-dashboard-notification.html',
  styleUrl: './vendor-dashboard-notification.scss',
})
export class VendorDashboardNotification {
  activeTab: '全部' | '未讀' | NotificationType = '全部';

  tabs: Array<'全部' | '未讀' | NotificationType> = [
    '全部',
    '未讀',
    '報名通知',
    '收款通知',
    '攤位通知',
    '活動通知',
  ];

  notifications: NotificationItem[] = [
    {
      icon: 'bi bi-clipboard-check',
      iconClass: 'orange',
      title: '草悟野餐市集收到 1 筆新的攤主報名',
      status: '待審核',
      statusClass: 'pending',
      date: '2026/06/02 14:30',
      unread: true,
      type: '報名通知',
    },
    {
      icon: 'bi bi-wallet2',
      iconClass: 'orange',
      title: '品牌「森日甜點」已提交付款資料',
      status: '付款待確認',
      statusClass: 'payment',
      date: '2026/06/02 13:10',
      unread: true,
      type: '收款通知',
    },
    {
      icon: 'bi bi-shop',
      iconClass: 'green',
      title: '品牌「木木手作」已完成攤位選擇',
      status: '已完成選位',
      statusClass: 'success',
      date: '2026/06/02 10:15',
      unread: false,
      type: '攤位通知',
    },
    {
      icon: 'bi bi-megaphone',
      iconClass: 'blue',
      title: '草悟野餐市集將於 7 天後開始',
      status: '活動即將開始',
      statusClass: 'info',
      date: '2026/06/01 16:20',
      unread: true,
      type: '活動通知',
    },
    {
      icon: 'bi bi-x-circle',
      iconClass: 'orange',
      title: '品牌「暖木咖啡」已取消本次報名',
      status: '已取消',
      statusClass: 'cancel',
      date: '2026/05/31 11:45',
      unread: false,
      type: '報名通知',
    },
    {
      icon: 'bi bi-wallet2',
      iconClass: 'orange',
      title: '品牌「秋日小舖」已提交付款資料',
      status: '付款待確認',
      statusClass: 'payment',
      date: '2026/05/30 15:05',
      unread: true,
      type: '收款通知',
    },
    {
      icon: 'bi bi-clipboard-check',
      iconClass: 'orange',
      title: '夏日綠意市集收到 1 筆新的攤主報名',
      status: '待審核',
      statusClass: 'pending',
      date: '2026/05/30 09:20',
      unread: false,
      type: '報名通知',
    },
    {
      icon: 'bi bi-shop',
      iconClass: 'green',
      title: '品牌「果嶼生活」已完成攤位選擇',
      status: '已完成選位',
      statusClass: 'success',
      date: '2026/05/29 17:40',
      unread: false,
      type: '攤位通知',
    },
  ];

  get filteredNotifications(): NotificationItem[] {
    if (this.activeTab === '全部') return this.notifications;
    if (this.activeTab === '未讀') {
      return this.notifications.filter((item) => item.unread);
    }

    return this.notifications.filter((item) => item.type === this.activeTab);
  }

  //切換 Tab 時回到第一頁
  /**
   * 切換類別標籤
   * @param tab - 可選值為 '全部'、'未讀' 或 NotificationType 中的任一類型
   */
  setTab(tab: '全部' | '未讀' | NotificationType): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  /** 將所有通知標記為已讀，全部已讀後也回第一頁 */
  markAllAsRead(): void {
    this.notifications = this.notifications.map((item) => ({
      ...item,
      unread: false,
    }));
    this.currentPage = 1;
  }

  /** 當前頁碼 */
  currentPage = 1;
  /** 每頁顯示的通知數量 */
  pageSize = 7;

  /** 計算頁數 */
  totalPages() {
    return Math.ceil(this.filteredNotifications.length / this.pageSize);
  }

  /**
   * 根據當前頁碼和每頁顯示的通知數量，返回當前頁面應顯示的通知列表
   * @returns 應顯示的通知列表
   */
  pagedNotifications(): NotificationItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredNotifications.slice(start, end);
  }

  /** 計算頁碼列表 */
  pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  /** 設置當前頁碼 */
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage = page;
  }
}
