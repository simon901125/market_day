import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { ActivityListItem } from '../../../../models/interface/admin/ActivityListItem';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

@Component({
  selector: 'app-admin-dashboard-market-managemant',
  imports: [
    Dropdown,
    DateRangeSelector,
    DashboardPagination,
  ],
  templateUrl: './admin-dashboard-market-managemant.html',
  styleUrl: './admin-dashboard-market-managemant.scss',
})
export class AdminDashboardMarketManagemant implements AfterViewInit {
  constructor(private router: Router) {}

  @ViewChild(DateRangeSelector) timeSelectorRef!: DateRangeSelector;
  @ViewChild('organizerDropdown') organizerDropdownRef!: Dropdown;
  @ViewChild('statusDropdown') statusDropdownRef!: Dropdown;
  @ViewChild('tableWrapper') tableWrapperRef!: ElementRef<HTMLDivElement>;

  /** 每列高度，需與 SCSS `.activity-table tbody tr` 的高度一致 */
  private readonly rowHeight = 56;
  /** 表頭高度，需與 SCSS `.activity-table thead tr` 的高度一致 */
  private readonly headerHeight = 48;

  /** 主辦方下拉選單 */
  organizerOptions = ['全部', '森林生活市集', '日日好市', '春語市集', '歡樂市集團隊'];

  /** 狀態下拉選單（排除草稿，草稿由後端過濾不會出現在此頁） */
  statusOptions: string[] = [
    '全部',
    ActivityStatus.pendingReview,
    ActivityStatus.revisionRequired,
    ActivityStatus.mapBuilding,
    ActivityStatus.readyToPublish,
    ActivityStatus.registrationOpen,
    ActivityStatus.full,
    ActivityStatus.published,
    ActivityStatus.active,
    ActivityStatus.ended,
    ActivityStatus.unpublished,
  ];

  /** 需要管理員處理（顯示「審核」按鈕）的狀態，其餘顯示「查看」 */
  private readonly needsReviewStatuses: string[] = [
    ActivityStatus.pendingReview,
    // ActivityStatus.revisionRequired,
    ActivityStatus.mapBuilding,
  ];

  /** 假資料：模擬後端回傳的活動列表，之後可替換成真正的 API 呼叫結果 */
  private readonly mockActivities: ActivityListItem[] = [
    { id: 1, image: 'assets/images/market/cards/market-card-01.png', name: '夏日綠意市集', organizer: '森林生活市集', startDate: '2026-07-01', endDate: '2026-07-02', status: ActivityStatus.pendingReview, createdAt: '2026-05-28 14:30' },
    { id: 2, image: 'assets/images/market/cards/market-card-02.png', name: '秋季手作市集', organizer: '日日好市', startDate: '2026-09-15', endDate: '2026-09-16', status: ActivityStatus.registrationOpen, createdAt: '2026-05-27 10:00' },
    { id: 3, image: 'assets/images/market/cards/market-card-03.png', name: '春語花市', organizer: '春語市集', startDate: '2026-05-01', endDate: '2026-05-02', status: ActivityStatus.full, createdAt: '2026-04-25 18:00' },
    { id: 4, image: 'assets/images/market/cards/market-card-04.png', name: '星光夜市集', organizer: '歡樂市集團隊', startDate: '2026-08-20', endDate: '2026-08-21', status: ActivityStatus.mapBuilding, createdAt: '2026-05-26 16:00' },
    { id: 5, image: 'assets/images/market/cards/market-card-05.png', name: '寵物歡聚市集', organizer: '森林生活市集', startDate: '2026-12-24', endDate: '2026-12-25', status: ActivityStatus.revisionRequired, createdAt: '2026-05-19 10:15' },
    { id: 6, image: 'assets/images/market/cards/market-card-06.png', name: '丹丹香農市集', organizer: '日日好市', startDate: '2026-10-05', endDate: '2026-10-06', status: ActivityStatus.registrationOpen, createdAt: '2026-05-18 15:00' },
    { id: 7, image: 'assets/images/market/cards/market-card-07.png', name: '楓糖森活市集', organizer: '春語市集', startDate: '2026-06-05', endDate: '2026-06-06', status: ActivityStatus.published, createdAt: '2026-05-20 09:30' },
    { id: 8, image: 'assets/images/market/cards/market-card-08.png', name: '海福生活市集', organizer: '歡樂市集團隊', startDate: '2026-07-18', endDate: '2026-07-19', status: ActivityStatus.unpublished, createdAt: '2026-05-17 15:30' },
    { id: 9, image: 'assets/images/market/cards/market-card-09.png', name: '晨光手作市集', organizer: '森林生活市集', startDate: '2026-06-20', endDate: '2026-06-21', status: ActivityStatus.active, createdAt: '2026-05-10 11:00' },
    { id: 10, image: 'assets/images/market/cards/market-card-10.png', name: '暖陽農夫市集', organizer: '日日好市', startDate: '2026-04-10', endDate: '2026-04-11', status: ActivityStatus.ended, createdAt: '2026-03-01 09:00' },
    { id: 11, image: 'assets/images/market/cards/market-card-01.png', name: '月光甜點市集', organizer: '春語市集', startDate: '2026-11-12', endDate: '2026-11-13', status: ActivityStatus.readyToPublish, createdAt: '2026-05-29 13:20' },
    { id: 12, image: 'assets/images/market/cards/market-card-02.png', name: '城市綠洲市集', organizer: '歡樂市集團隊', startDate: '2026-09-01', endDate: '2026-09-02', status: ActivityStatus.pendingReview, createdAt: '2026-05-30 09:00' },
    { id: 13, image: 'assets/images/market/cards/market-card-03.png', name: '海岸風情市集', organizer: '森林生活市集', startDate: '2026-08-08', endDate: '2026-08-09', status: ActivityStatus.registrationOpen, createdAt: '2026-05-15 10:00' },
    { id: 14, image: 'assets/images/market/cards/market-card-04.png', name: '童趣手作市集', organizer: '日日好市', startDate: '2026-07-25', endDate: '2026-07-26', status: ActivityStatus.full, createdAt: '2026-05-14 14:00' },
    { id: 15, image: 'assets/images/market/cards/market-card-05.png', name: '山林野營市集', organizer: '春語市集', startDate: '2026-10-20', endDate: '2026-10-21', status: ActivityStatus.mapBuilding, createdAt: '2026-05-25 11:30' },
    { id: 16, image: 'assets/images/market/cards/market-card-06.png', name: '老街懷舊市集', organizer: '歡樂市集團隊', startDate: '2026-06-13', endDate: '2026-06-14', status: ActivityStatus.revisionRequired, createdAt: '2026-05-22 17:00' },
    { id: 17, image: 'assets/images/market/cards/market-card-07.png', name: '花漾市集', organizer: '森林生活市集', startDate: '2026-05-30', endDate: '2026-05-31', status: ActivityStatus.published, createdAt: '2026-05-12 08:45' },
    { id: 18, image: 'assets/images/market/cards/market-card-08.png', name: '夜光氣球市集', organizer: '日日好市', startDate: '2026-08-30', endDate: '2026-08-31', status: ActivityStatus.unpublished, createdAt: '2026-04-28 13:00' },
    { id: 19, image: 'assets/images/market/cards/market-card-09.png', name: '早晨咖啡市集', organizer: '春語市集', startDate: '2026-06-01', endDate: '2026-06-02', status: ActivityStatus.active, createdAt: '2026-05-05 09:10' },
    { id: 20, image: 'assets/images/market/cards/market-card-10.png', name: '冬季暖心市集', organizer: '歡樂市集團隊', startDate: '2026-01-10', endDate: '2026-01-11', status: ActivityStatus.ended, createdAt: '2025-12-01 10:00' },
    { id: 21, image: 'assets/images/market/cards/market-card-01.png', name: '文創手作市集', organizer: '森林生活市集', startDate: '2026-11-01', endDate: '2026-11-02', status: ActivityStatus.readyToPublish, createdAt: '2026-05-31 16:40' },
    { id: 22, image: 'assets/images/market/cards/market-card-02.png', name: '寶寶用品市集', organizer: '日日好市', startDate: '2026-09-20', endDate: '2026-09-21', status: ActivityStatus.pendingReview, createdAt: '2026-06-01 09:00' },
    { id: 23, image: 'assets/images/market/cards/market-card-03.png', name: '復古玩具市集', organizer: '春語市集', startDate: '2026-07-10', endDate: '2026-07-11', status: ActivityStatus.registrationOpen, createdAt: '2026-05-23 14:50' },
    { id: 24, image: 'assets/images/market/cards/market-card-04.png', name: '手沖咖啡市集', organizer: '歡樂市集團隊', startDate: '2026-08-15', endDate: '2026-08-16', status: ActivityStatus.full, createdAt: '2026-05-21 10:25' },
  ];

  /** 目前篩選條件：主辦方 */
  private selectedOrganizer = '';
  /** 目前篩選條件：狀態 */
  private selectedStatus = '';
  /** 目前輸入的搜尋關鍵字 */
  searchKeyword = '';

  /** 目前頁面顯示的活動列表（已套用篩選＋分頁） */
  activities: ActivityListItem[] = [];

  /** 目前頁碼 */
  currentPage = 1;
  /** 每頁筆數，依畫面剩餘高度動態計算（見 Task 8），初始為合理預設值 */
  pageSize = 8;
  /** 篩選後的總筆數 */
  totalItems = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.recalculatePageSize();
      this.fetchActivities();
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const previousPageSize = this.pageSize;
    this.recalculatePageSize();

    if (this.pageSize !== previousPageSize) {
      this.currentPage = 1;
      this.fetchActivities();
    }
  }

  onOrganizerSelected(value: string): void {
    this.selectedOrganizer = value === '全部' ? '' : value;
  }

  onStatusSelected(value: string): void {
    this.selectedStatus = value === '全部' ? '' : value;
  }

  /** 更新搜尋關鍵字 */
  onSearchKeywordInput(event: Event): void {
    this.searchKeyword = (event.target as HTMLInputElement).value;
  }

  /** 搜尋按鈕：彙整篩選條件後重新查詢（回到第一頁） */
  onSearch(): void {
    this.currentPage = 1;
    this.fetchActivities();
  }

  /** 切換頁碼：每次切頁都重新呼叫一次「後端」 */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchActivities();
  }

  /** 產生操作欄位按鈕的點擊處理函式，導向活動詳細頁 */
  getDetailHandler(activity: ActivityListItem): () => void {
    return () => this.goToDetail(activity);
  }

  private goToDetail(activity: ActivityListItem): void {
    this.router.navigate(['/admin/dash-board/activity/detail', activity.id], {
      state: { activity },
    });
  }

  /**
   * 取得活動列表（目前為假資料模擬，之後請替換成真正的後端 API 呼叫）
   *
   * 之後串接 API 時，請求需帶入：
   *   - page：目前頁碼（this.currentPage）
   *   - pageSize：每頁筆數（this.pageSize，依畫面剩餘高度動態算出，每次都可能不同）
   *   - keyword／organizer／status／startDate／endDate：搜尋列篩選條件
   *
   * 後端需要做的事：
   *   1. 用 page + pageSize 算 offset，只回傳「該頁」的資料（data）
   *   2. 依篩選條件做查詢／過濾
   *   3. 回傳符合篩選條件後的「總筆數」(totalItems)，前端會用它換算總頁數與「共 N 筆」文字
   *      → 預期回應格式：{ data: ActivityListItem[]; totalItems: number }
   *
   * 範例（替換時的寫法）：
   *   this.http.get<{ data: ActivityListItem[]; totalItems: number }>('/api/admin/activities', {
   *     params: { page: this.currentPage, pageSize: this.pageSize, keyword, organizer: this.selectedOrganizer, status: this.selectedStatus, startDate, endDate }
   *   }).subscribe(res => {
   *     this.activities = res.data;
   *     this.totalItems = res.totalItems;
   *   });
   */
  private fetchActivities(): void {
    const keyword = this.searchKeyword.trim();
    const { startDate, endDate } = this.timeSelectorRef?.getTimeRange() ?? {
      startDate: null,
      endDate: null,
    };

    const filtered = this.mockActivities.filter((item) => {
      const matchKeyword = !keyword || item.name.includes(keyword);
      const matchOrganizer = !this.selectedOrganizer || item.organizer === this.selectedOrganizer;
      const matchStatus = !this.selectedStatus || item.status === this.selectedStatus;
      const matchStart = !startDate || item.startDate >= startDate;
      const matchEnd = !endDate || item.endDate <= endDate;
      return matchKeyword && matchOrganizer && matchStatus && matchStart && matchEnd;
    });

    this.totalItems = filtered.length;

    const start = (this.currentPage - 1) * this.pageSize;
    this.activities = filtered.slice(start, start + this.pageSize);
  }

  /** 依表格容器目前的高度，重新計算一頁可顯示的列數 */
  private recalculatePageSize(): void {
    const wrapperHeight = this.tableWrapperRef.nativeElement.clientHeight;
    const availableHeight = wrapperHeight - this.headerHeight;
    this.pageSize = Math.max(Math.floor(availableHeight / this.rowHeight), 1);
  }

  /** 取得狀態對應的標籤顏色 class */
  getStatusClass(status: string): string {
    return ActivityStatus.getClass(status);
  }

  /** 是否需要顯示「審核」按鈕（否則顯示「查看」） */
  isReviewNeeded(status: string): boolean {
    return this.needsReviewStatuses.includes(status);
  }
}
