import { Component } from '@angular/core';
import { DashboardNotification } from '../../../dashboard/dashboard-notification/dashboard-notification';
import {
  NotificationItem,
  NotificationType,
} from '../../../../models/NotificationItem';

@Component({
  selector: 'app-organizer-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './organizer-dashboard-notification.html',
  styleUrl: './organizer-dashboard-notification.scss',
})
export class OrganizerDashboardNotification {
  tabs: Array<'全部' | '未讀' | NotificationType> = [
    '全部',
    '未讀',
    '報名相關',
    '付款相關',
    '活動異動',
    '系統公告',
  ];

  notifications: NotificationItem[] = [
    {
      icon: 'bi bi-calendar-event',
      iconClass: 'orange',
      title: '品牌「森日甜點」送出報名申請：夏日綠意市集',
      status: '新報名',
      statusClass: 'pending',
      date: '2026/06/02 14:30',
      unread: true,
      type: '報名相關',
    },
    {
      icon: 'bi bi-wallet2',
      iconClass: 'blue',
      title: '品牌「木木手作」已完成付款：貓貓森林市集',
      status: '付款完成',
      statusClass: 'payment',
      date: '2026/06/02 13:10',
      unread: true,
      type: '付款相關',
    },
    {
      icon: 'bi bi-arrow-repeat',
      iconClass: 'green',
      title: '品牌「草語選物」申請退款：夏日綠意市集',
      status: '退款申請',
      statusClass: 'refund',
      date: '2026/06/02 11:45',
      unread: true,
      type: '付款相關',
    },
    {
      icon: 'bi bi-pencil',
      iconClass: 'purple',
      title: '品牌已完成補件並重新送審',
      status: '補件完成',
      statusClass: 'success',
      date: '2026/06/02 10:15',
      unread: false,
      type: '報名相關',
    },
  ];
}