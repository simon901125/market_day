import { Component } from '@angular/core';
import { DashboardNotification, NotificationItem } from '../../../shared/dashboard/dashboard-notification/dashboard-notification';

@Component({
  selector: 'app-organizer-dashboard-notification',
  imports: [DashboardNotification],
  templateUrl: './organizer-dashboard-notification.html',
  styleUrl: './organizer-dashboard-notification.scss',
})
export class OrganizerDashboardNotification {
  /** 通知中心分類頁籤。 */
  tabs = ['全部', '未讀', '報名', '付款', '退款', '活動', '公告'];

  /** 通知中心列表資料，之後串接 API 時改由後端回傳。 */
  notifications: NotificationItem[] = [
    {
      icon: 'bi bi-clipboard-heart',
      iconClass: 'orange',
      status: '新報名',
      title: '「夏日綠意市集」收到新的攤主報名申請，請前往報名管理查看。',
      date: '2026/06/02 14:30',
      unread: true,
      type: '報名',
    },
    {
      icon: 'bi bi-wallet2',
      iconClass: 'blue',
      status: '付款完成',
      title: '攤主已完成付款，請確認付款狀態與攤位資料。',
      date: '2026/06/02 13:10',
      unread: true,
      type: '付款',
    },
    {
      icon: 'bi bi-arrow-repeat',
      iconClass: 'green',
      status: '退款申請',
      title: '有攤主送出退款申請，請至退款管理進行處理。',
      date: '2026/06/02 11:45',
      unread: true,
      type: '退款',
    },
    {
      icon: 'bi bi-pencil',
      iconClass: 'purple',
      status: '補件提醒',
      title: '活動資料需要補件，請修改後重新送出審核。',
      date: '2026/06/02 10:15',
      unread: false,
      type: '活動',
    },
    {
      icon: 'bi bi-map',
      iconClass: 'teal',
      status: '地圖完成',
      title: '活動攤位地圖已建置完成，可前往活動詳情確認。',
      date: '2026/06/01 16:20',
      unread: false,
      type: '活動',
    },
    {
      icon: 'bi bi-megaphone',
      iconClass: 'yellow',
      status: '活動公告',
      title: '系統公告：請於活動開始前確認攤位配置與品牌公開資料。',
      date: '2026/05/29 09:30',
      unread: false,
      type: '公告',
    },
  ];
}
