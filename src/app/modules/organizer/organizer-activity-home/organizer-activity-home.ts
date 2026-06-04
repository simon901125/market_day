import { Component } from '@angular/core';
import { FlowStep } from '../../../models/FlowStep';
import { Activity } from '../../../models/Activity';
import { SummaryCard } from '../../../models/SummaryCard';
import { Notice } from '../../../models/Notice';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-organizer-activity-home',
  imports: [RouterLink],
  templateUrl: './organizer-activity-home.html',
  styleUrl: './organizer-activity-home.scss',
})
export class OrganizerActivityHome {
  // false：首次引導頁面
  // true：首頁資料頁面
  hasActivities = true;

  /** 流程步驟 */
  steps: FlowStep[] = [
    { title: '建立活動', desc: '設定活動名稱、時間、地點與介紹資訊', icon: 'bi-file-earmark-plus' },
    { title: '開放報名', desc: '設定報名量數、條件與開放 / 截止時間', icon: 'bi-megaphone' },
    { title: '審核攤主', desc: '審核報名資料，確認攤主資格', icon: 'bi-person-check' },
    { title: '確認付款', desc: '確認攤主付款，完成收款管理', icon: 'bi-credit-card' },
    { title: '活動進行', desc: '活動當天順利進行，享受市集時光！', icon: 'bi-shop' },
  ];

  /** 摘要卡片 */
  summaryCards: SummaryCard[] = [
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

  /** 活動列表 */
  activities: Activity[] = [
    {
      image: 'assets/images/activity-1.jpg',
      name: '夏日綠意市集',
      date: '2025/08/01 – 2025/08/03',
      location: '台北市信義區 香堤大道',
      status: '待機',
      statusClass: 'waiting',
      progress: '-',
      paid: '-',
    },
    {
      image: 'assets/images/activity-2.jpg',
      name: '貓貓森林市集',
      date: '2025/06/15 – 2025/06/16',
      location: '新北市板橋區 新板特區公園',
      status: '報名中',
      statusClass: 'active',
      progress: '128 / 150',
      paid: '95',
    },
    {
      image: 'assets/images/activity-3.jpg',
      name: '秋日手作市集',
      date: '2025/09/13 – 2025/09/13',
      location: '台中文化創意園區',
      status: '已額滿',
      statusClass: 'full',
      progress: '80 / 80',
      paid: '80',
    },
  ];

  /** 通知 */
  notices: Notice[] = [
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
   * 根據通知類型獲取對應的圖示
   * @param type 通知類型
   * @returns 圖示名稱
   */
  getNoticeIcon(type: Notice['type']): string {
    return {
      signup: 'bi-clipboard-check',
      payment: 'bi-wallet2',
      booth: 'bi-shop',
    }[type];
  }
}
