import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { DashboardHomeTodoCard } from '../../../shared/dashboard/dashboard-home-todo-card/dashboard-home-todo-card';
import {
  DashboardNotification,
  NotificationItem,
} from '../../../shared/dashboard/dashboard-notification/dashboard-notification';

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
  imports: [RouterLink, DashboardHomeTodoCard, DashboardNotification],
  templateUrl: './vendor-dashboard-home.html',
  styleUrl: './vendor-dashboard-home.scss',
})
export class VendorDashboardHome {
  /** 是否有紀錄 */
  hasRecords = false;

  readonly homeNotificationMaxItems = 6;

  constructor(private readonly authService: AuthService) {}

  get vendorName(): string {
    return this.authService.getUser('vendor')?.name?.trim() || '攤主';
  }

  readonly todoItems: VendorHomeCard[] = [
    { icon: 'bi-clipboard-check', count: 1, unit: '筆', label: '待審核報名', path: '/vendor/dash-board/application-record', iconColor: 'orange' },
    { icon: 'bi-wallet2', count: 1, unit: '筆', label: '待付款報名', path: '/vendor/dash-board/application-record', iconColor: 'orange' },
    { icon: 'bi-shop', count: 1, unit: '筆', label: '待選擇攤位', path: '/vendor/dash-board/application-record', iconColor: 'blue' },
    { icon: 'bi-arrow-counterclockwise', count: 1, unit: '筆', label: '退款處理中', path: '/vendor/dash-board/application-record', iconColor: 'purple' },
  ];

  readonly notifications: NotificationItem[] = [
    {
      icon: 'bi bi-clipboard-check',
      iconClass: 'orange',
      status: '審核中',
      title: '您的「夏日綠意市集」報名資料已送出，主辦方正在審核。',
      date: '2026/06/02 14:30',
      unread: true,
      type: '報名',
    },
    {
      icon: 'bi bi-wallet2',
      iconClass: 'blue',
      status: '待付款',
      title: '您的報名已通過審核，請於付款期限內完成付款。',
      date: '2026/06/02 13:10',
      unread: true,
      type: '付款',
    },
    {
      icon: 'bi bi-shop',
      iconClass: 'green',
      status: '選位完成',
      title: '您已完成「植感生活市集」所有活動日期的攤位選擇。',
      date: '2026/06/02 10:15',
      unread: false,
      type: '攤位',
    },
    {
      icon: 'bi bi-arrow-counterclockwise',
      iconClass: 'purple',
      status: '退款處理中',
      title: '主辦方已收到退款申請，款項正在處理中。',
      date: '2026/06/01 16:20',
      unread: false,
      type: '退款',
    },
    {
      icon: 'bi bi-calendar-event',
      iconClass: 'orange',
      status: '活動提醒',
      title: '「春日手作生活節」將於三天後開始，請提前確認進場資訊。',
      date: '2026/06/01 11:30',
      unread: false,
      type: '活動',
    },
    {
      icon: 'bi bi-check-circle',
      iconClass: 'green',
      status: '報名完成',
      title: '您的「植感生活市集」報名流程已全部完成。',
      date: '2026/05/31 15:45',
      unread: false,
      type: '報名',
    },
    {
      icon: 'bi bi-megaphone',
      iconClass: 'purple',
      status: '主辦公告',
      title: '活動進場動線已更新，請於活動前查看最新公告。',
      date: '2026/05/30 09:20',
      unread: false,
      type: '公告',
    },
    {
      icon: 'bi bi-cash-coin',
      iconClass: 'blue',
      status: '退款完成',
      title: '退款款項已退回信用卡，實際入帳時間依發卡銀行為準。',
      date: '2026/05/29 16:10',
      unread: false,
      type: '退款',
    },
    {
      icon: 'bi bi-geo-alt',
      iconClass: 'green',
      status: '進場提醒',
      title: '活動進場時間為 12:30，請攜帶攤主證明並依現場指示報到。',
      date: '2026/05/28 13:40',
      unread: false,
      type: '活動',
    },
    {
      icon: 'bi bi-info-circle',
      iconClass: 'blue',
      status: '選位開放',
      title: '「夏日綠意市集」攤位選擇已開放，請於期限內完成選位。',
      date: '2026/05/28 10:20',
      unread: false,
      type: '攤位',
    },
  ];

}
