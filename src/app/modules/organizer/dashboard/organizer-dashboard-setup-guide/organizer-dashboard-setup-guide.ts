import { Component } from '@angular/core';
import { ManageFeature, SetupStep } from '../../../../models/interface/organizer/OrganizerSetupGuide';

@Component({
  selector: 'app-organizer-dashboard-setup-guide',
  standalone: true,
  imports: [],
  templateUrl: './organizer-dashboard-setup-guide.html',
  styleUrl: './organizer-dashboard-setup-guide.scss',
})
export class OrganizerDashboardSetupGuide {
  /** 主辦方建立第一場活動前的設定流程說明。 */
  readonly setupSteps: SetupStep[] = [
    {
      step: 1,
      icon: 'bi-person',
      title: '完成主辦方資料',
      description: '填寫主辦單位名稱、聯絡資訊與基本資料，讓攤主與使用者能清楚辨識主辦方。',
    },
    {
      step: 2,
      icon: 'bi-file-earmark-text',
      title: '建立活動資料',
      description: '設定活動名稱、封面、介紹、活動時間與報名期間，完成活動基本資訊。',
    },
    {
      step: 3,
      icon: 'bi-geo-alt',
      title: '規劃場地與攤位',
      description: '填寫活動地點、攤位尺寸、攤位分區與配置圖，方便後續審核與選位。',
    },
    {
      step: 4,
      icon: 'bi-send',
      title: '送出活動審核',
      description: '確認所有資料無誤後送出審核，等待管理員確認配置圖與活動內容。',
    },
  ];

  /** 後台主要管理功能介紹。 */
  readonly manageFeatures: ManageFeature[] = [
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
      icon: 'bi-currency-dollar',
      title: '帳務管理',
      description: '彙整活動收益與保證金資料，方便後續對帳。',
    },
  ];
}
