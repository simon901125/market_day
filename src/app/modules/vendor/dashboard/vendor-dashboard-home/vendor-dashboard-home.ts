import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardNotification } from '../../../../models/DashboardNotification';
import { DashboardSummaryCard } from '../../../../models/DashboardSummaryCard';

@Component({
  selector: 'app-vendor-dashboard-home',
  imports: [RouterLink],
  templateUrl: './vendor-dashboard-home.html',
  styleUrl: './vendor-dashboard-home.scss',
})
export class VendorDashboardHome {
  /** 是否有紀錄 */
  hasRecords = true;

  /** 首頁儀表板摘要資訊 */
  summaryCards: DashboardSummaryCard[] = [
    {
      title: '審核中報名',
      count: 1,
      unit: '筆',
      icon: 'bi-clipboard-check',
      link: '/vendor/dash-board/register-record',
    },
    {
      title: '待付款報名',
      count: 1,
      unit: '筆',
      icon: 'bi-wallet2',
      link: '/vendor/dash-board/register-record',
    },
    {
      title: '已選攤位',
      count: 1,
      unit: '個',
      icon: 'bi-shop',
      iconClass: 'blue',
      link: '/vendor/dash-board/stall',
    },
  ];

  /** 首頁最新通知列表 */
  notices: DashboardNotification[] = [
    {
      type: 'signup',
      text: '你報名的「草悟野餐市集」已送出，等待主辦方審核',
      status: '審核中',
      statusClass: 'pending',
      date: '2026/06/02 14:30',
      unread: true,
    },
    {
      type: 'payment',
      text: '「夏日綠意市集」報名審核通過，請於期限內完成付款',
      status: '待付款',
      statusClass: 'payment',
      date: '2026/06/02 13:10',
      unread: true,
    },
    {
      type: 'booth',
      text: '你已完成「貓貓森林市集」攤位選擇',
      status: '已完成選位',
      statusClass: 'success',
      date: '2026/06/02 10:15',
      unread: false,
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