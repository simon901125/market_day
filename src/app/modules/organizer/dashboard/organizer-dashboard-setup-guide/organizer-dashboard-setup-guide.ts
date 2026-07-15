import { Component } from '@angular/core';
import { OrganizerProfileDialogService } from '../../../../core/services/organizer-profile-dialog.service';
import { SetupStep } from '../../../../models/interface/organizer/OrganizerSetupGuide';

@Component({
  selector: 'app-organizer-dashboard-setup-guide',
  standalone: true,
  imports: [],
  templateUrl: './organizer-dashboard-setup-guide.html',
  styleUrl: './organizer-dashboard-setup-guide.scss',
})
export class OrganizerDashboardSetupGuide {
  constructor(private readonly organizerProfileDialog: OrganizerProfileDialogService) {}

  /** 主辦方建立第一場活動前的設定流程說明。 */
  readonly setupSteps: SetupStep[] = [
    {
      step: 1,
      icon: 'bi-card-text',
      title: '活動基本資料',
      description: '設定活動名稱、類型、封面與活動介紹。',
    },
    {
      step: 2,
      icon: 'bi-clock',
      title: '活動時間',
      description: '設定活動日期、時段與攤主報名期間。',
    },
    {
      step: 3,
      icon: 'bi-geo-alt',
      title: '活動場地與攤位規劃',
      description: '設定活動地點、地圖與攤位配置。',
    },
    {
      step: 4,
      icon: 'bi-lightning-charge',
      title: '活動設備與用電設定',
      description: '設定設備租借與活動用電方案。',
    },
  ];

  openOrganizerProfile(): void {
    this.organizerProfileDialog.open();
  }
}
