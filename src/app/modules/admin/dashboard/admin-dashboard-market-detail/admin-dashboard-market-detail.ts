import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../core/services/alert.service';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { ActivityListItem } from '../../../../models/interface/admin/ActivityListItem';
import { AdminMarketDetail } from '../../../../models/interface/admin/AdminMarketDetail';

/** 模擬後端列表資料，串接 API 後可移除 */
const MOCK_ACTIVITIES: ActivityListItem[] = [
  { id: 1,  image: 'assets/images/market/cards/market-card-01.png', name: '夏日綠意市集',   organizer: '森林生活市集',   startDate: '2026-07-01', endDate: '2026-07-02', status: ActivityStatus.pendingReview,    createdAt: '2026-05-28 14:30' },
  { id: 2,  image: 'assets/images/market/cards/market-card-02.png', name: '秋季手作市集',   organizer: '日日好市',       startDate: '2026-09-15', endDate: '2026-09-16', status: ActivityStatus.registrationOpen, createdAt: '2026-05-27 10:00' },
  { id: 3,  image: 'assets/images/market/cards/market-card-03.png', name: '春語花市',       organizer: '春語市集',       startDate: '2026-05-01', endDate: '2026-05-02', status: ActivityStatus.full,             createdAt: '2026-04-25 18:00' },
  { id: 4,  image: 'assets/images/market/cards/market-card-04.png', name: '星光夜市集',     organizer: '歡樂市集團隊',   startDate: '2026-08-20', endDate: '2026-08-21', status: ActivityStatus.mapBuilding,      createdAt: '2026-05-26 16:00' },
  { id: 5,  image: 'assets/images/market/cards/market-card-05.png', name: '寵物歡聚市集',   organizer: '森林生活市集',   startDate: '2026-12-24', endDate: '2026-12-25', status: ActivityStatus.revisionRequired,  createdAt: '2026-05-19 10:15' },
  { id: 6,  image: 'assets/images/market/cards/market-card-06.png', name: '丹丹香農市集',   organizer: '日日好市',       startDate: '2026-10-05', endDate: '2026-10-06', status: ActivityStatus.registrationOpen, createdAt: '2026-05-18 15:00' },
  { id: 7,  image: 'assets/images/market/cards/market-card-07.png', name: '楓糖森活市集',   organizer: '春語市集',       startDate: '2026-06-05', endDate: '2026-06-06', status: ActivityStatus.published,        createdAt: '2026-05-20 09:30' },
  { id: 8,  image: 'assets/images/market/cards/market-card-08.png', name: '海福生活市集',   organizer: '歡樂市集團隊',   startDate: '2026-07-18', endDate: '2026-07-19', status: ActivityStatus.unpublished,      createdAt: '2026-05-17 15:30' },
  { id: 9,  image: 'assets/images/market/cards/market-card-09.png', name: '晨光手作市集',   organizer: '森林生活市集',   startDate: '2026-06-20', endDate: '2026-06-21', status: ActivityStatus.active,           createdAt: '2026-05-10 11:00' },
  { id: 10, image: 'assets/images/market/cards/market-card-10.png', name: '暖陽農夫市集',   organizer: '日日好市',       startDate: '2026-04-10', endDate: '2026-04-11', status: ActivityStatus.ended,            createdAt: '2026-03-01 09:00' },
  { id: 11, image: 'assets/images/market/cards/market-card-01.png', name: '月光甜點市集',   organizer: '春語市集',       startDate: '2026-11-12', endDate: '2026-11-13', status: ActivityStatus.readyToPublish,   createdAt: '2026-05-29 13:20' },
  { id: 12, image: 'assets/images/market/cards/market-card-02.png', name: '城市綠洲市集',   organizer: '歡樂市集團隊',   startDate: '2026-09-01', endDate: '2026-09-02', status: ActivityStatus.pendingReview,    createdAt: '2026-05-30 09:00' },
  { id: 13, image: 'assets/images/market/cards/market-card-03.png', name: '海岸風情市集',   organizer: '森林生活市集',   startDate: '2026-08-08', endDate: '2026-08-09', status: ActivityStatus.registrationOpen, createdAt: '2026-05-15 10:00' },
  { id: 14, image: 'assets/images/market/cards/market-card-04.png', name: '童趣手作市集',   organizer: '日日好市',       startDate: '2026-07-25', endDate: '2026-07-26', status: ActivityStatus.full,             createdAt: '2026-05-14 14:00' },
  { id: 15, image: 'assets/images/market/cards/market-card-05.png', name: '山林野營市集',   organizer: '春語市集',       startDate: '2026-10-20', endDate: '2026-10-21', status: ActivityStatus.mapBuilding,      createdAt: '2026-05-25 11:30' },
  { id: 16, image: 'assets/images/market/cards/market-card-06.png', name: '老街懷舊市集',   organizer: '歡樂市集團隊',   startDate: '2026-06-13', endDate: '2026-06-14', status: ActivityStatus.revisionRequired,  createdAt: '2026-05-22 17:00' },
  { id: 17, image: 'assets/images/market/cards/market-card-07.png', name: '花漾市集',       organizer: '森林生活市集',   startDate: '2026-05-30', endDate: '2026-05-31', status: ActivityStatus.published,        createdAt: '2026-05-12 08:45' },
  { id: 18, image: 'assets/images/market/cards/market-card-08.png', name: '夜光氣球市集',   organizer: '日日好市',       startDate: '2026-08-30', endDate: '2026-08-31', status: ActivityStatus.unpublished,      createdAt: '2026-04-28 13:00' },
  { id: 19, image: 'assets/images/market/cards/market-card-09.png', name: '早晨咖啡市集',   organizer: '春語市集',       startDate: '2026-06-01', endDate: '2026-06-02', status: ActivityStatus.active,           createdAt: '2026-05-05 09:10' },
  { id: 20, image: 'assets/images/market/cards/market-card-10.png', name: '冬季暖心市集',   organizer: '歡樂市集團隊',   startDate: '2026-01-10', endDate: '2026-01-11', status: ActivityStatus.ended,            createdAt: '2025-12-01 10:00' },
  { id: 21, image: 'assets/images/market/cards/market-card-01.png', name: '文創手作市集',   organizer: '森林生活市集',   startDate: '2026-11-01', endDate: '2026-11-02', status: ActivityStatus.readyToPublish,   createdAt: '2026-05-31 16:40' },
  { id: 22, image: 'assets/images/market/cards/market-card-02.png', name: '寶寶用品市集',   organizer: '日日好市',       startDate: '2026-09-20', endDate: '2026-09-21', status: ActivityStatus.pendingReview,    createdAt: '2026-06-01 09:00' },
  { id: 23, image: 'assets/images/market/cards/market-card-03.png', name: '復古玩具市集',   organizer: '春語市集',       startDate: '2026-07-10', endDate: '2026-07-11', status: ActivityStatus.registrationOpen, createdAt: '2026-05-23 14:50' },
  { id: 24, image: 'assets/images/market/cards/market-card-04.png', name: '手沖咖啡市集',   organizer: '歡樂市集團隊',   startDate: '2026-08-15', endDate: '2026-08-16', status: ActivityStatus.full,             createdAt: '2026-05-21 10:25' },
];

/** 模擬後端詳細資料，串接 API 後可移除 */
const MOCK_DETAIL: AdminMarketDetail = {
  activityId: 2,
  activityStatus: ActivityStatus.pendingUnpublish,
  activityInfo: {
    name: '夏日綠意市集',
    type: '生活文創・生活選物・綠市場',
    time: '2026/07/01 ~ 2026/08/02 10:00 ~ 19:00',
    location: '台北市信義區君悅大道',
    description: '夏天，是感受夏天好精選的季節。我們誠摯邀請一起品嚐這裡—在林蔭散策散步中，整城市到土地與人們的距離與共鳴。\n\n現場有豐富音樂現場演出和手作攤位，探索自然蔬食品和真實農夫，美食飲品音樂和演奏，適合全家人一起感受豐盛的美好時光。',
  },
  timeline: {
    registrationStartTime: '2026/05/01  10:00',
    registrationEndTime: '2026/05/15  23:59',
    finalListConfirmation: '2026/05/29  12:00',
    activityTime: '2026/07/01 ~ 2026/07/02',
  },
  organizerInfo: {
    organizerName: '森林生活市集',
    contactPerson: '林子庭',
    contactPhone: '0912-345-678',
    email: 'forest@marketday.com',
    address: '台北市大安區忠孝東路四段127號8樓',
    taxId: '98765432',
    serviceHours: '週一 ~ 週五 09:00 ~ 18:00',
  },
  transportation: {
    mrt: '捷運忠孝3號出口步行5分鐘',
    bus: '藍5・紅12・北新幹線',
    drivingDirections: '市政府地下停車場（步行約6分鐘）',
  },
  boothInfo: {
    boothSpec: '3m x 3m x 2.5m',
    boothCount: 90,
    boothPrice: 2500,
    boothZones: ['A區：50攤', 'B區：20攤', 'C區：20攤'],
  },
  boothLayoutImage: 'assets/images/market/cards/market-card-01.png',
  statusLogs: [
    {
      dateTime: '2026/06/20  10:15',
      status: ActivityStatus.pendingReview,
      description: '主辦方已送出活動申請，等待審核。',
      operator: { role: '主辦方', operatorName: '森林生活市集（林子庭）' },
    },
    {
      dateTime: '2026/05/21  11:30',
      status: ActivityStatus.revisionRequired,
      description: '審核中發現問題，通知主辦方補件，請重新上傳資料。',
      operator: { role: '管理員', operatorName: 'Admin' },
    },
    {
      dateTime: '2026/05/22  14:00',
      status: ActivityStatus.pendingReview,
      description: '主辦方已完成補件，重新送出申請，等待審核。',
      operator: { role: '主辦方', operatorName: '森林生活市集（林子庭）' },
    },
    {
      dateTime: '2026/06/23  10:03',
      status: ActivityStatus.pendingReview,
      description: '主辦方已送出活動申請，等待管理員審核。',
      operator: { role: '管理員', operatorName: 'Admin' },
    },
  ],
};

@Component({
  selector: 'app-admin-dashboard-market-detail',
  imports: [CommonModule],
  templateUrl: './admin-dashboard-market-detail.html',
  styleUrl: './admin-dashboard-market-detail.scss',
})
export class AdminDashboardMarketDetail implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
  ) {}

  activity: ActivityListItem | null = null;
  detail: AdminMarketDetail | null = null;
  readonly ActivityStatus = ActivityStatus;

  ngOnInit(): void {
    const stateActivity: ActivityListItem | undefined = history.state?.activity;

    if (stateActivity) {
      this.activity = stateActivity;
    } else {
      const id = Number(this.route.snapshot.params['id']);
      this.activity = MOCK_ACTIVITIES.find(a => a.id === id) ?? null;
    }

    if (this.activity?.id === MOCK_DETAIL.activityId) {
      this.detail = MOCK_DETAIL;
    }
  }

  getStatusClass(status: string): string {
    return ActivityStatus.getClass(status);
  }

  goBack(): void {
    this.router.navigate(['/admin/dash-board/activity']);
  }

  onRequireSupplementHandler = async (): Promise<void> => {
    await this.openRequireSupplementForm();
  };

  private async openRequireSupplementForm(initialReason = ''): Promise<void> {
    const result = await this.alert.custom<string>({
      html: `
        <div class="registration-swal-content">
          <div class="supplement-swal-header">
            <div class="restore-confirm-icon">
              <i class="bi bi-exclamation-circle"></i>
            </div>
            <h3>要求補件</h3>
            <p class="registration-swal-main">此活動申請資料需補件，<br>請填寫補件原因後送出通知。</p>
          </div>
          <label class="registration-swal-field">
            <span>補件原因</span>
            <textarea id="supplementReason" class="supplement-swal-textarea" maxlength="200" placeholder="請輸入需補充或修正的內容"></textarea>
            <em class="supplement-swal-counter" id="supplementCount">0/200</em>
          </label>
          <p class="registration-swal-field-error" aria-live="polite"></p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '確認送出',
      cancelButtonText: '取消',
      reverseButtons: true,
      customClass: {
        popup: 'require-supplement-swal',
      },
      didOpen: () => {
        const textarea = document.getElementById('supplementReason') as HTMLTextAreaElement;
        const counter = document.getElementById('supplementCount');
        if (initialReason && textarea) {
          textarea.value = initialReason;
          if (counter) counter.textContent = `${initialReason.length}/200`;
        }
        textarea?.addEventListener('input', () => {
          if (counter) counter.textContent = `${textarea.value.length}/200`;
        });
      },
      preConfirm: () => {
        const textarea = document.getElementById('supplementReason') as HTMLTextAreaElement;
        const value = textarea?.value?.trim() ?? '';
        const error = document.querySelector<HTMLElement>('.registration-swal-field-error');
        if (!value) {
          if (error) error.textContent = '請填寫補件原因';
          return false;
        }
        if (error) error.textContent = '';
        return value;
      },
    });

    if (!result.isConfirmed || !result.value) return;
    await this.openRequireSupplementConfirm(result.value);
  }

  private async openRequireSupplementConfirm(reason: string): Promise<void> {
    const escapedReason = reason
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const result = await this.alert.custom({
      html: `
        <div class="registration-swal-content">
          <div class="supplement-swal-header">
            <div class="restore-confirm-icon">
              <i class="bi bi-exclamation-circle"></i>
            </div>
            <h3>要求補件確認</h3>
            <p class="registration-swal-main">確定要求此活動申請補件嗎？<br>送出後，主辦方將收到補件通知，<br>活動狀態將變更為「補件中」。</p>
          </div>
          <div class="registration-swal-field">
            <span>補件原因</span>
            <div class="supplement-swal-reason-box">${escapedReason}</div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '確認送出',
      cancelButtonText: '返回修改',
      reverseButtons: true,
      customClass: {
        popup: 'require-supplement-swal',
      },
    });

    if ((result.dismiss as string) === 'cancel') {
      await this.openRequireSupplementForm(reason);
      return;
    }

    if (!result.isConfirmed) return;

    // TODO: 呼叫後端 API，將活動狀態改為「補件中」
    this.alert.success(
      '補件要求已送出',
      '補件要求成功送出。<br />活動狀態更新為「補件中」，已通知送主辦方補件。',
      '確認',
    );
  }

  onApproveHandler = async (): Promise<void> => {
    const confirmed = await this.alert.confirm(
      '審核通過',
      '確定通過此活動申請?<br />活動將進入「地圖建置中」狀態，待完成攤位地圖建置後開放報名。',
      '確認送出',
      '取消',
    );

    if (!confirmed) return;

    // TODO: 呼叫後端 API，將活動狀態改為「地圖建置中」
    this.alert.success(
      '審核通過',
      '活動資料已審核通過。<br />活動已進入「地圖建置中狀態」，請盡速建立攤位地圖。',
      '知道了',
    );
  };

  onMapBuildingDoneHandler = async (): Promise<void> => {
    const confirmed = await this.alert.confirm(
      '確定送出地圖建置',
      '確定送出地圖建置嗎?<br />送出後活動狀態將更新為 「待發布」，主辦方確認後即可正式發布活動',
      '確認送出',
      '取消',
    );

    if (!confirmed) return;

    // TODO: 呼叫後端 API，將活動狀態改為「待發布」
    this.alert.success(
      '地圖建置已送出',
      '地圖建置成功送出。<br />活動狀態更新為「待發布」， 並通知主辦方確認活動內容。',
    );
  };

  onUnpublishHandler = async (): Promise<void> => {
    const confirmed = await this.alert.confirm(
      '確定下架活動',
      '確定要下架此活動嗎?<br />下架後活動狀態將更新為「已下架」，主辦方將收到通知。',
      '確認下架',
      '取消',
    );

    if (!confirmed) return;

    // TODO: 呼叫後端 API，將活動狀態改為「已下架」
    this.alert.success(
      '活動已下架',
      '活動已成功下架。<br />活動狀態更新為「已下架」，已通知主辦方。',
    );
  };

  downloadImg = (): void => {
    // TODO: 呼叫後端 API，下載圖片
  };
}
