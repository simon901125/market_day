import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ManageFeature, SetupStep } from '../../../../models/interface/organizer/OrganizerSetupGuide';

@Component({
  selector: 'app-organizer-dashboard-setup-guide',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './organizer-dashboard-setup-guide.html',
  styleUrl: './organizer-dashboard-setup-guide.scss',
})
export class OrganizerDashboardSetupGuide {
  /** 主辦方建立第一場活動前的設定流程說明。 */
  readonly setupSteps: SetupStep[] = [
    {
      step: 1,
      icon: 'bi-card-text',
      title: '活動基本資料',
      description: '設定活動名稱、類型、封面圖片與活動介紹。',
    },
    {
      step: 2,
      icon: 'bi-clock',
      title: '活動時間',
      description: '設定活動日期、活動時段與攤主報名期間。',
    },
    {
      step: 3,
      icon: 'bi-geo-alt',
      title: '活動場地與攤位規劃',
      description: '設定活動地點、地圖、攤位分區與配置方式。',
    },
    {
      step: 4,
      icon: 'bi-lightning-charge',
      title: '活動設備與用電設定',
      description: '設定設備提供、設備租借與活動用電方案。',
    },
  ];

  /** 後台主要管理功能介紹。 */
  readonly manageFeatures: ManageFeature[] = [
    {
      icon: 'bi-calendar-event',
      title: '活動管理',
      description: '建立與管理活動資料，查看審核狀態與活動進度。',
    },
    {
      icon: 'bi-clipboard-heart',
      title: '報名管理',
      description: '查看攤主報名資料、審核資格，掌握活動招商進度。',
    },
    {
      icon: 'bi-wallet2',
      title: '收款管理',
      description: '確認付款狀態、退款申請與金流紀錄。',
    },
    {
      icon: 'bi-map',
      title: '攤位管理',
      description: '查看攤位分配與選位狀態，協助活動現場規劃。',
    },
    {
      icon: 'bi-box-seam',
      title: '設備管理',
      description: '設定活動租借設備、可用數量與相關費用。',
    },
    {
      icon: 'bi-currency-dollar',
      title: '帳務管理',
      description: '彙整活動收益與保證金資料，方便後續對帳。',
    },
  ];
}
