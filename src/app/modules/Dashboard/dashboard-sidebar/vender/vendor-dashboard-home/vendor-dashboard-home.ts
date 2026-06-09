import { Component } from '@angular/core';
import { DashboardSummaryCard } from '../../../../../models/DashboardSummaryCard';
import { DashboardNotification } from '../../../../../models/DashboardNotification';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard-home',
  imports: [RouterLink],
  templateUrl: './vendor-dashboard-home.html',
  styleUrl: './vendor-dashboard-home.scss',
})
export class VendorDashboardHome {
  // 之後接 API 判斷是否有報名 / 通知 / 攤位紀錄
  /** 是否有紀錄 */
  hasRecords = false; // false = 首次登入引導，true = 儀錶板

  /** 首頁儀表板摘要資訊 */
  summaryCards: DashboardSummaryCard[] = [
    {
      title: '待審核報名',
      count: 12,
      unit: '筆',
      icon: 'bi-clipboard-check',
      link: '/organizer/register-manage',
    },
    {
      title: '待確認付款',
      count: 6,
      unit: '筆',
      icon: 'bi-wallet2',
      link: '/organizer/payment-manage',
    },
    {
      title: '即將開始活動',
      count: 2,
      unit: '場',
      icon: 'bi-calendar3',
      iconClass: 'blue',
      link: '/organizer/activity-manage',
    },
  ];

  /** 首頁最新通知列表 */
  notices: DashboardNotification[] = [
    {
      type: 'signup',
      text: '草悟野餐市集收到 1 筆新的攤主報名',
      status: '待審核',
      statusClass: 'pending',
      date: '2026/06/02 14:30',
      unread: true,
    },
    {
      type: 'payment',
      text: '品牌「森日甜點」已提交付款資料',
      status: '付款待確認',
      statusClass: 'payment',
      date: '2026/06/02 13:10',
      unread: true,
    },
    {
      type: 'booth',
      text: '品牌「木木手作」已完成攤位選擇',
      status: '已完成選位',
      statusClass: 'success',
      date: '2026/06/02 10:15',
    },
  ];

  /**
   * 根據通知類型取得對應的 Bootstrap Icon
   * signup  → 報名通知
   * payment → 付款通知
   * booth   → 攤位通知
   * 
   * @param type 通知類型
   * @returns Bootstrap Icon Class
   */
  getNoticeIcon(type: DashboardNotification['type']): string {
    return {
      signup: 'bi-clipboard-check',
      payment: 'bi-wallet2',
      booth: 'bi-shop',
    }[type];
  }
}
