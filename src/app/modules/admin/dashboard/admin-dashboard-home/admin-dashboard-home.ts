import { Component, HostListener, OnInit } from '@angular/core';
import { AdminDashboardNotification } from '../admin-dashboard-notification/admin-dashboard-notification';
import { DashboardHomeTodoCard } from '../../../shared/dashboard/dashboard-home-todo-card/dashboard-home-todo-card';
import { DashboardNotification } from '../../../shared/dashboard/dashboard-notification/dashboard-notification';

/**
 * 管理員首頁待處理事項資料格式
 */
interface TodoItem {
  icon: string;
  count: number;
  unit: string;
  label: string;
  path: string;
  iconColor?: string;
}

/**
 * 管理員首頁平台概況資料格式
 */
interface StatItem {
  icon: string;
  value: number;
  unit: string;
  label: string;
  iconColor?: string;
}

@Component({
  selector: 'app-admin-dashboard-home',
  imports: [DashboardHomeTodoCard, DashboardNotification],
  templateUrl: './admin-dashboard-home.html',
  styleUrl: './admin-dashboard-home.scss',
})
export class AdminDashboardHome extends AdminDashboardNotification implements OnInit {
  /**
   * 首頁最新通知顯示筆數
   *
   * 小畫面：顯示 3 筆
   * 大畫面：顯示 4 筆
   */
  homeNotificationMaxItems = 4;

  /**
   * 元件初始化時，先依照目前畫面高度決定最新通知顯示筆數
   */
  ngOnInit(): void {
    this.updateHomeNotificationMaxItems();
  }

  /**
   * 監聽瀏覽器視窗大小變化
   *
   * 當使用者調整視窗高度時，重新計算最新通知顯示筆數
   */
  @HostListener('window:resize')
  onResize(): void {
    this.updateHomeNotificationMaxItems();
  }

  /**
   * 依照視窗高度更新首頁最新通知顯示筆數
   *
   * 最少顯示 2 筆
   * 最多顯示 8 筆
   */
  private updateHomeNotificationMaxItems(): void {
    const height = window.innerHeight;

    const usedHeight = 455;
    const notificationItemHeight = 76;

    const availableHeight = height - usedHeight;
    const count = Math.floor(availableHeight / notificationItemHeight);

    this.homeNotificationMaxItems = Math.min(8, Math.max(4, count));
  }

  /**
   * 待處理事項卡片資料
   */
  todoItems: TodoItem[] = [
    {
      icon: 'bi-calendar-event',
      count: 5,
      unit: '筆',
      label: '活動審核',
      path: '/admin/dash-board/activity',
      iconColor: 'orange',
    },
    {
      icon: 'bi-map',
      count: 2,
      unit: '筆',
      label: '活動地圖建置',
      path: '/admin/dash-board/activity',
      iconColor: 'orange',
    },
    {
      icon: 'bi-arrow-down',
      count: 2,
      unit: '筆',
      label: '活動下架申請',
      path: '/admin/dash-board/activity',
      iconColor: 'orange',
    },
    {
      icon: 'bi-exclamation-triangle',
      count: 1,
      unit: '筆',
      label: '異常提醒',
      path: '/admin/dash-board/logs',
      iconColor: 'red',
    },
  ];

  /**
   * 平台概況卡片資料
   */
  platformStats: StatItem[] = [
    { icon: 'bi-people', value: 32, unit: '位', label: '主辦方總數', iconColor: 'teal' },
    { icon: 'bi-shop', value: 126, unit: '位', label: '攤主總數', iconColor: 'blue' },
    { icon: 'bi-calendar-check', value: 18, unit: '場', label: '活動總數', iconColor: 'purple' },
    { icon: 'bi-flag', value: 7, unit: '場', label: '進行中活動', iconColor: 'green' },
  ];
}
