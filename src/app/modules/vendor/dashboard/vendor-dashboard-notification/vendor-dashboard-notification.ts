import { Component } from '@angular/core';
import { DashboardNotification } from '../../../dashboard/dashboard-notification/dashboard-notification';
import { NotificationItem, NotificationType } from '../../../../models/interface/NotificationItem';

@Component({
  selector: 'app-vendor-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './vendor-dashboard-notification.html',
  styleUrl: './vendor-dashboard-notification.scss',
})
export class VendorDashboardNotification {
  /** 標籤 */
  tabs: Array<'全部' | '未讀' | NotificationType> = [
    '全部',
    '未讀',
    '報名通知',
    '收款通知',
    '攤位通知',
    '活動通知',
  ];

  /** 通知列 */
  notifications: NotificationItem[] = [
  {
    icon: 'bi bi-clipboard-check',
    iconClass: 'orange',
    title: '你已送出「草悟野餐市集」報名申請',
    status: '審核中',
    statusClass: 'pending',
    date: '2026/06/02 14:30',
    unread: true,
    type: '報名通知',
  },
  {
    icon: 'bi bi-wallet2',
    iconClass: 'orange',
    title: '「夏日綠意市集」報名審核通過，請於期限內完成付款',
    status: '待付款',
    statusClass: 'payment',
    date: '2026/06/02 13:10',
    unread: true,
    type: '收款通知',
  },
  {
    icon: 'bi bi-shop',
    iconClass: 'green',
    title: '你已完成「貓貓森林市集」攤位選擇',
    status: '已完成選位',
    statusClass: 'success',
    date: '2026/06/02 10:15',
    unread: false,
    type: '攤位通知',
  },
  {
    icon: 'bi bi-megaphone',
    iconClass: 'blue',
    title: '「草悟野餐市集」將於 7 天後開始，請確認活動資訊',
    status: '活動即將開始',
    statusClass: 'info',
    date: '2026/06/01 16:20',
    unread: true,
    type: '活動通知',
  },
];
}