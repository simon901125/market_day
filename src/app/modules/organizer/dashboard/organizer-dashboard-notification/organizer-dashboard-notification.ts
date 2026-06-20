import { Component } from '@angular/core';
import { DashboardNotification, NotificationItem } from '../../../shared/dashboard/dashboard-notification/dashboard-notification';

@Component({
  selector: 'app-organizer-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './organizer-dashboard-notification.html',
  styleUrl: './organizer-dashboard-notification.scss',
})
export class OrganizerDashboardNotification {
  tabs = ['全部', '未讀', '報名', '付款', '退款', '活動', '系統'];

  notifications: NotificationItem[] = [
    {
      icon: 'bi bi-clipboard-heart',
      iconClass: 'orange',
      status: '新報名',
      title: '品牌「森日甜點」送出報名申請：夏日綠意市集',
      date: '2026/06/02 14:30',
      unread: true,
      type: '報名',
    },
    {
      icon: 'bi bi-wallet2',
      iconClass: 'blue',
      status: '付款完成',
      title: '品牌「木木手作」已完成付款：貓貓森林市集',
      date: '2026/06/02 13:10',
      unread: true,
      type: '付款',
    },
    {
      icon: 'bi bi-arrow-repeat',
      iconClass: 'green',
      status: '退款申請',
      title: '品牌「草語選物」申請退款：夏日綠意市集',
      date: '2026/06/02 11:45',
      unread: true,
      type: '退款',
    },
    {
      icon: 'bi bi-pencil',
      iconClass: 'purple',
      status: '補件完成',
      title: '品牌「日常手作所」已完成補件並重新送審：秋日手作市集',
      date: '2026/06/02 10:15',
      unread: false,
      type: '報名',
    },
    {
      icon: 'bi bi-map',
      iconClass: 'teal',
      status: '完成選位',
      title: '品牌「木木手作」已完成攤位選擇：貓貓森林市集',
      date: '2026/06/01 16:20',
      unread: false,
      type: '活動',
    },
    {
      icon: 'bi bi-megaphone',
      iconClass: 'yellow',
      status: '活動異動',
      title: '夏日綠意市集活動時間調整，請參考最新公告',
      date: '2026/05/29 09:30',
      unread: false,
      type: '系統',
    },
  ];
}
