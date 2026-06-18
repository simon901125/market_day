import { Component, Input, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

/** 首頁通知卡片資料結構 */
export interface NotificationItem {
  /** Bootstrap icon class，例如 bi-bell */
  icon: string;
  /** icon 配色 class，使用 styles.scss 定義的全域 class：green / blue / orange / purple / teal / yellow / red */
  iconColor: string;
  /** 通知標籤文字 */
  tag: string;
  /** 通知內文 */
  content: string;
  /** 通知時間文字 */
  time: string;
  /** 是否為未讀狀態 */
  unread?: boolean;
}

@Component({
  selector: 'app-dashboard-home-notifications',
  imports: [RouterLink],
  templateUrl: './dashboard-home-notifications.html',
  styleUrl: './dashboard-home-notifications.scss',
})
export class DashboardHomeNotifications implements AfterViewInit {
  /** 通知資料清單 */
  @Input() notifications: NotificationItem[] = [];

  /** 查看全部連結 */
  @Input() viewAllLink = '/admin/dash-board/notification';

  /** 目前可顯示的最大筆數（由容器高度計算） */
  maxItems = 5;

  /** 每筆通知列的固定高度（px）；需與 SCSS 中 .notification-item 的 min-height 一致 */
  private readonly ITEM_HEIGHT = 65;

  /** section-header 區域佔用的高度（px），含 margin-bottom */
  private readonly HEADER_HEIGHT = 60;

  constructor(private el: ElementRef) {}

  /** 視窗 resize 時重新計算可顯示筆數 */
  @HostListener('window:resize')
  updateMaxItems(): void {
    const containerHeight: number = this.el.nativeElement.offsetHeight;
    const available = containerHeight - this.HEADER_HEIGHT;
    this.maxItems = Math.max(3, Math.floor(available / this.ITEM_HEIGHT));
  }

  /** 視圖初始化完成後計算初始筆數 */
  ngAfterViewInit(): void {
    // 延遲一個渲染周期，確保父元素高度已撐開
    setTimeout(() => this.updateMaxItems(), 0);
  }

  /** 依 maxItems 截取顯示的通知資料 */
  get displayedNotifications(): NotificationItem[] {
    return this.notifications.slice(0, this.maxItems);
  }

  /** 補足到 maxItems 的空白佔位陣列 */
  get placeholders(): number[] {
    const count = this.maxItems - this.displayedNotifications.length;
    return count > 0 ? Array.from({ length: count }, (_, i) => i) : [];
  }

  /** 將指定通知標記為已讀 */
  markAsRead(item: NotificationItem): void {
    item.unread = false;
  }
}
