import { Component } from '@angular/core';

interface SetupStep {
  step: number;
  icon: string;
  title: string;
  description: string;
}

interface ManageFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-organizer-dashboard-setup-guide',
  standalone: true,
  imports: [],
  templateUrl: './organizer-dashboard-setup-guide.html',
  styleUrl: './organizer-dashboard-setup-guide.scss',
})
export class OrganizerDashboardSetupGuide {
  /** 建立第一場市集前，主辦方需要先完成的 4 個設定步驟。 */
  readonly setupSteps: SetupStep[] = [
    {
      step: 1,
      icon: 'bi-person',
      title: '填寫主辦方資料',
      description: '建立主辦單位基本資料，包括聯絡方式、地址與服務時間等資訊。',
    },
    {
      step: 2,
      icon: 'bi-file-earmark-text',
      title: '建立活動資料',
      description: '設定活動名稱、時間、地點、報名期間與品牌類別等活動基本資訊。',
    },
    {
      step: 3,
      icon: 'bi-geo-alt',
      title: '設定攤位資訊',
      description: '上傳攤位配置圖，設定分區與攤位編號。',
    },
    {
      step: 4,
      icon: 'bi-send',
      title: '送出管理員審核',
      description: '活動與攤位設定完成後，送交系統管理員審核。',
    },
  ];

  /** 通過審核後，主辦方後台可以管理的主要功能。 */
  readonly manageFeatures: ManageFeature[] = [
    {
      icon: 'bi-clipboard-heart',
      title: '報名審核',
      description: '審核攤主報名申請，管理報名狀態。',
    },
    {
      icon: 'bi-wallet2',
      title: '收款狀態',
      description: '查看付款與退款狀態，掌握收款進度。',
    },
    {
      icon: 'bi-map',
      title: '攤位選位',
      description: '查看攤主選位結果，確認最終攤位名單。',
    },
    {
      icon: 'bi-currency-dollar',
      title: '帳務管理',
      description: '查看活動收款統計與帳務明細。',
    },
  ];
}
