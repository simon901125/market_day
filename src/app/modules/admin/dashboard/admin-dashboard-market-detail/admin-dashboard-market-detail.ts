import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { ActivityListItem } from '../../../../models/interface/admin/ActivityListItem';

/** 模擬後端資料，串接 API 後可移除 */
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

@Component({
  selector: 'app-admin-dashboard-market-detail',
  imports: [],
  templateUrl: './admin-dashboard-market-detail.html',
  styleUrl: './admin-dashboard-market-detail.scss',
})
export class AdminDashboardMarketDetail implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  activity: ActivityListItem | null = null;
  readonly ActivityStatus = ActivityStatus;

  ngOnInit(): void {
    const stateActivity: ActivityListItem | undefined = history.state?.activity;

    if (stateActivity) {
      this.activity = stateActivity;
    } else {
      // 頁面重新整理時，history.state 消失，改用路由 ID 模擬後端重抓
      // 串接 API 後替換成：this.http.get<ActivityListItem>(`/api/admin/activities/${id}`).subscribe(...)
      const id = Number(this.route.snapshot.params['id']);
      this.activity = MOCK_ACTIVITIES.find(a => a.id === id) ?? null;
    }
  }

  onRequireSupplementHandler = (): void => {
    // TODO: 呼叫後端 API，將活動狀態改為「補件中」
  };

  onApproveHandler = (): void => {
    // TODO: 呼叫後端 API，將活動狀態改為「地圖建置中」
  };

  onMapBuildingDoneHandler = (): void => {
    // TODO: 呼叫後端 API，將活動狀態改為「待發布」
  };
}
