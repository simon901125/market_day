import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { OrganizerEventRow } from '../../../../models/interface/organizer/OrganizerEventRow';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { DashboardDataTable, DashboardTableAction, DashboardTableColumn } from '../../../shared/dashboard/dashboard-data-table/dashboard-data-table';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { AlertService } from '../../../../core/services/alert.service';
import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';

@Component({
  selector: 'app-organizer-dashboard-event-management',
  imports: [FormsModule, DashboardDataTable, DashboardPagination, Dropdown, DateRangeSelector, RouterLink],
  templateUrl: './organizer-dashboard-event-management.html',
  styleUrl: './organizer-dashboard-event-management.scss',
})
export class OrganizerDashboardEventManagement implements OnInit {
  /** 日期區間元件，用來取得列表搜尋的起訖日期。 */
  @ViewChild(DateRangeSelector) private dateRangeSelector?: DateRangeSelector;

  /** 目前分頁。 */
  currentPage = 1;

  /** 每頁顯示筆數。 */
  pageSize = 6;

  /** 目前選取的活動狀態。空字串代表全部狀態。 */
  selectedStatus = '';

  /** 活動名稱搜尋輸入值。 */
  searchKeyword = '';

  /** 日期篩選起日。 */
  filterStartDate: string | null = null;

  /** 日期篩選迄日。 */
  filterEndDate: string | null = null;

  /** 已套用的活動名稱搜尋條件。 */
  private appliedKeyword = '';

  /** 已套用的日期篩選起日。 */
  private appliedStartDate: string | null = null;

  /** 已套用的日期篩選迄日。 */
  private appliedEndDate: string | null = null;

  /** 活動狀態下拉選單選項。 */
  readonly statusOptions = ActivityStatus.filterList;

  /** 活動管理列表欄位設定。 */
  columns: DashboardTableColumn[] = [
    { key: 'name', label: '活動名稱', type: 'imageText', width: '15%' },
    { key: 'date', label: '活動日期', nowrap: true, width: '14%' },
    { key: 'status', label: '活動狀態', type: 'status', align: 'center', width: '9%' },
    { key: 'location', label: '活動地點', width: '17%' },
    { key: 'signupProgress', label: '報名人數', type: 'progress', align: 'center', nowrap: true, width: '9%' },
    { key: 'pendingReviewCount', label: '待審核', align: 'center', nowrap: true, width: '8%' },
    { key: 'paidCount', label: '付款人數', align: 'center', nowrap: true, width: '8%' },
    { key: 'selectedCount', label: '已選位', align: 'center', nowrap: true, width: '8%' },
    { key: 'action', label: '', type: 'action', align: 'end', width: '12%' },
  ];

  /**
   * 活動管理列表目前使用前端假資料。
   * 後續串接 API 時可保留欄位結構，改由服務層取得資料。
   */
  rows: OrganizerEventRow[] = [
    {
      id: 1,
      name: '夏日綠意市集',
      nameImage: 'assets/images/market/cards/market-card-01.png',
      date: '2026/06/15 - 2026/06/21',
      location: '台北市 信義區 草悟廣場',
      status: ActivityStatus.pendingReview,
      signupProgress: '128 / 150',
      paidCount: '118',
      actionLabel: '查看',
    },
    {
      id: 2,
      name: '職人咖啡生活市集',
      nameImage: 'assets/images/market/cards/market-card-02.png',
      date: '2026/06/27 - 2026/06/28',
      location: '台北市 中正區 華山文創園區',
      status: ActivityStatus.revisionRequired,
      signupProgress: '120 / 120',
      paidCount: '102',
      actionLabel: '查看',
    },
    {
      id: 3,
      name: '衣著選物週末',
      nameImage: 'assets/images/market/cards/market-card-03.png',
      date: '2026/07/04 - 2026/07/05',
      location: '新北市 板橋區 新板萬坪公園',
      status: ActivityStatus.mapBuilding,
      signupProgress: '100 / 100',
      paidCount: '96',
      actionLabel: '查看',
    },
    {
      id: 4,
      name: '風格選物生活節',
      nameImage: 'assets/images/market/cards/market-card-04.png',
      date: '2026/07/18 - 2026/07/19',
      location: '台中市 西區 勤美草悟道',
      status: ActivityStatus.readyToPublish,
      signupProgress: '64 / 90',
      paidCount: '58',
      actionLabel: '查看',
    },
    {
      id: 5,
      name: '毛孩友善市集',
      nameImage: 'assets/images/market/cards/market-card-05.png',
      date: '2026/08/01 - 2026/08/02',
      location: '高雄市 鹽埕區 駁二藝術特區',
      status: ActivityStatus.registrationOpen,
      signupProgress: '72 / 110',
      paidCount: '63',
      actionLabel: '查看',
    },
    {
      id: 6,
      name: '植感生活市集',
      nameImage: 'assets/images/market/cards/market-card-06.png',
      date: '2026/08/15 - 2026/08/16',
      location: '桃園市 中壢區 青塘園',
      status: ActivityStatus.full,
      signupProgress: '54 / 100',
      paidCount: '46',
      actionLabel: '查看',
    },
    {
      id: 7,
      name: '烘焙陶作午後市集',
      nameImage: 'assets/images/market/cards/market-card-07.png',
      date: '2026/09/05 - 2026/09/06',
      location: '台南市 中西區 河樂廣場',
      status: ActivityStatus.published,
      signupProgress: '48 / 80',
      paidCount: '41',
      actionLabel: '查看',
    },
    {
      id: 8,
      name: '草地親子手作日',
      nameImage: 'assets/images/market/cards/market-card-08.png',
      date: '2026/09/19 - 2026/09/20',
      location: '新竹市 東區 關新公園',
      status: ActivityStatus.active,
      signupProgress: '36 / 90',
      paidCount: '29',
      actionLabel: '查看',
    },
    {
      id: 9,
      name: '月光手作夜市集',
      nameImage: 'assets/images/market/cards/market-card-09.png',
      date: '2026/10/03 - 2026/10/04',
      location: '台中市 西屯區 中央公園',
      status: ActivityStatus.registrationOpen,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看',
    },
    {
      id: 10,
      name: '海風編織選物市集',
      nameImage: 'assets/images/market/cards/market-card-10.png',
      date: '2026/11/14 - 2026/11/15',
      location: '基隆市 中正區 正濱漁港',
      status: ActivityStatus.unpublished,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看',
    },
    {
      id: 16,
      name: '河岸文創週末市集',
      nameImage: 'assets/images/market/cards/market-card-09.png',
      date: '2026/10/17 - 2026/10/18',
      location: '新北市 板橋區 新月橋河濱廣場',
      status: ActivityStatus.unpublishRequested,
      signupProgress: '76 / 90',
      paidCount: '71',
      actionLabel: '查看',
    },
    {
      id: 11,
      name: '春日野餐市集',
      nameImage: 'assets/images/market/history/history-market-01.png',
      date: '2025/04/12 - 2025/04/13',
      location: '台北市 大安區 大安森林公園',
      status: ActivityStatus.ended,
      signupProgress: '80 / 80',
      paidCount: '80',
      actionLabel: '查看',
    },
    {
      id: 12,
      name: '手感工藝生活節',
      nameImage: 'assets/images/market/history/history-market-02.png',
      date: '2025/05/18 - 2025/05/19',
      location: '台中市 西區 審計新村',
      status: ActivityStatus.ended,
      signupProgress: '68 / 70',
      paidCount: '68',
      actionLabel: '查看',
    },
    {
      id: 13,
      name: '老街綠意選物市集',
      nameImage: 'assets/images/market/history/history-market-03.png',
      date: '2025/06/07 - 2025/06/08',
      location: '台南市 中西區 蝸牛巷',
      status: ActivityStatus.ended,
      signupProgress: '74 / 80',
      paidCount: '72',
      actionLabel: '查看',
    },
    {
      id: 14,
      name: '港邊手作假日',
      nameImage: 'assets/images/market/history/history-market-04.png',
      date: '2025/07/12 - 2025/07/13',
      location: '高雄市 鼓山區 棧貳庫',
      status: ActivityStatus.ended,
      signupProgress: '88 / 90',
      paidCount: '86',
      actionLabel: '查看',
    },
    {
      id: 15,
      name: '草木試營小集',
      nameImage: 'assets/images/shared/no-image-placeholder.svg',
      date: '',
      location: '',
      status: ActivityStatus.draft,
      signupProgress: '',
      paidCount: '',
      canSubmitReview: false,
      actionLabel: '查看',
    },
  ];

  /** 目前頁面實際顯示的資料。 */
  displayRows: OrganizerEventRow[] = [];
  private serverTotalItems = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alert: AlertService,
    private readonly organizerApi: OrganizerApiService,
  ) {}

  /** 初始化列表，並從網址 query params 還原搜尋、篩選與分頁狀態。 */
  ngOnInit(): void {
    const pageFromUrl = Number(this.route.snapshot.queryParamMap.get('page'));
    const statusFromUrl = this.route.snapshot.queryParamMap.get('status') ?? '';
    this.searchKeyword = this.route.snapshot.queryParamMap.get('keyword') ?? '';
    this.filterStartDate = this.route.snapshot.queryParamMap.get('startDate');
    this.filterEndDate = this.route.snapshot.queryParamMap.get('endDate');
    this.appliedKeyword = this.searchKeyword.trim().toLocaleLowerCase();
    this.appliedStartDate = this.filterStartDate;
    this.appliedEndDate = this.filterEndDate;

    if (Number.isInteger(pageFromUrl) && pageFromUrl > 0) {
      this.currentPage = pageFromUrl;
    }

    if (this.statusOptions.includes(statusFromUrl) && statusFromUrl !== ActivityStatus.all) {
      this.selectedStatus = statusFromUrl;
    }

    this.loadEvents();
  }

  /** 依照狀態、名稱與日期區間回傳篩選後的活動。 */
  get filteredRows(): OrganizerEventRow[] {
    return this.rows.filter((row) => {
      const matchesStatus = !this.selectedStatus || row.status === this.selectedStatus;
      const matchesName = !this.appliedKeyword || row.name.toLocaleLowerCase().includes(this.appliedKeyword);
      const [activityStartDate, activityEndDate] = row.date.split(' - ').map((date) => date.replaceAll('/', '-'));
      const matchesStartDate = !this.appliedStartDate || activityEndDate >= this.appliedStartDate;
      const matchesEndDate = !this.appliedEndDate || activityStartDate <= this.appliedEndDate;
      return matchesStatus && matchesName && matchesStartDate && matchesEndDate;
    });
  }

  /** 篩選後的總筆數。 */
  get totalItems(): number {
    return this.serverTotalItems;
  }

  /** 切換分頁。 */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.syncListQueryParams();
    this.loadEvents();
  }

  /** 切換活動狀態篩選。 */
  selectStatus(status: string): void {
    this.selectedStatus = status === ActivityStatus.all ? '' : status;
    this.currentPage = 1;
    this.syncListQueryParams();
    this.loadEvents();
  }

  /** 執行搜尋；之後串接 API 時可在這裡改為呼叫服務層。 */
  searchActivities(): void {
    const range = this.dateRangeSelector?.getTimeRange() ?? {
      startDate: this.filterStartDate,
      endDate: this.filterEndDate,
    };
    let startDate = range.startDate;
    let endDate = range.endDate;

    if (startDate && endDate && startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }

    this.filterStartDate = startDate;
    this.filterEndDate = endDate;
    this.appliedKeyword = this.searchKeyword.trim().toLocaleLowerCase();
    this.appliedStartDate = startDate;
    this.appliedEndDate = endDate;
    this.currentPage = 1;
    this.syncListQueryParams();
    this.loadEvents();
  }

  /** 點擊列表操作按鈕，帶著返回列表所需狀態前往活動詳情。 */
  async onTableAction(action: DashboardTableAction): Promise<void> {
    const activity = action.row as unknown as OrganizerEventRow;
    if (action.key === 'unpublish') {
      await this.requestUnpublish(activity);
      return;
    }

    if (await this.handleQuickStatusAction(action.key ?? '', activity)) {
      return;
    }

    if (action.key === 'edit') {
      this.router.navigate(['/organizer/dash-board/activity/detail'], {
        queryParams: {
          edit: activity.id,
          returnPage: this.currentPage,
          returnStatus: this.selectedStatus || null,
        },
        state: {
          activity,
          returnPage: this.currentPage,
          returnStatus: this.selectedStatus,
        },
      });
      return;
    }

    this.router.navigate(['/organizer/dash-board/activity/detail', activity.id], {
      queryParams: {
        returnPage: this.currentPage,
        returnStatus: this.selectedStatus || null,
      },
      state: {
        activity,
        returnPage: this.currentPage,
        returnStatus: this.selectedStatus,
      },
    });
  }

  /** 列表上不需閱讀完整資料的單一步驟狀態操作，統一使用確認 Alert。 */
  private async handleQuickStatusAction(actionKey: string, activity: OrganizerEventRow): Promise<boolean> {
    switch (actionKey) {
      case 'submit':
        if (!await this.alert.confirm(
          '送出審核確認',
          `確定要送出「${activity.name}」進行審核嗎？<br>送出後將暫時無法編輯活動內容，需等待審核結果。`,
          '確定送出',
        )) return true;
        this.updateActivityStatus(activity.id, ActivityStatus.pendingReview);
        await this.alert.success(
          '送出審核成功',
          `活動「${activity.name}」已送出審核，審核結果將透過通知中心告知。`,
          '知道了',
        );
        return true;
      case 'withdraw':
        if (!await this.alert.confirm(
          '撤回申請確認',
          `確定要撤回「${activity.name}」的審核申請嗎？<br>撤回後活動將回到草稿狀態，可再次編輯與送審。`,
          '確定撤回',
        )) return true;
        this.updateActivityStatus(activity.id, ActivityStatus.draft, { canSubmitReview: true });
        await this.alert.success(
          '申請已撤回',
          `活動「${activity.name}」已回到草稿狀態。`,
          '知道了',
        );
        return true;
      case 'resubmit':
        if (!await this.alert.confirm(
          '重新送審確認',
          `確定要重新送審「${activity.name}」嗎？<br>送出後將再次進入審核流程。`,
          '確定重新送審',
        )) return true;
        this.updateActivityStatus(activity.id, ActivityStatus.pendingReview);
        await this.alert.success(
          '重新送審成功',
          `活動「${activity.name}」已重新送出審核。`,
          '知道了',
        );
        return true;
      case 'publish':
        if (!await this.alert.confirm(
          '發布活動確認',
          `確定要發布「${activity.name}」嗎？<br>發布後活動將對外公開並開放瀏覽與報名。`,
          '確定發布',
        )) return true;
        this.updateActivityStatus(activity.id, ActivityStatus.registrationOpen);
        await this.alert.success(
          '發布活動成功',
          `活動「${activity.name}」已發布並進入「報名中」狀態。`,
          '知道了',
        );
        return true;
      default:
        return false;
    }
  }

  private updateActivityStatus(
    activityId: number,
    status: string,
    changes: Partial<OrganizerEventRow> = {},
  ): void {
    this.rows = this.rows.map((row) => row.id === activityId ? { ...row, ...changes, status } : row);
    this.updateDisplayRows();
  }

  private async requestUnpublish(activity: OrganizerEventRow): Promise<void> {
    const reason = await this.alert.requiredReason({
      title: '申請下架活動',
      description: `請填寫「${activity.name}」的下架原因，送出後將由管理員審核。`,
      fieldLabel: '下架原因',
      placeholder: '請說明申請下架活動的原因',
      confirmButtonText: '下一步',
    });
    if (!reason) return;

    const confirmed = await this.alert.confirmReason({
      title: '確認送出下架申請',
      description: '請確認活動與下架原因，送出後將進入管理員審核流程。',
      subjectLabel: '活動名稱',
      subject: activity.name,
      reasonLabel: '下架原因',
      reason,
      confirmButtonText: '確認送出',
    });
    if (!confirmed) return;

    this.rows = this.rows.map((row) => row.id === activity.id
      ? { ...row, status: ActivityStatus.unpublishRequested, unpublishReason: reason }
      : row);
    this.updateDisplayRows();

    await this.alert.success(
      '下架申請已送出',
      `活動「${activity.name}」已進入下架審核流程。<br>審核完成前，活動狀態為「下架申請中」。`,
      '知道了',
    );
  }

  /** 同步列表狀態到 query params，讓返回頁面時可以還原目前篩選條件。 */
  private syncListQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        status: this.selectedStatus || null,
        keyword: this.searchKeyword.trim() || null,
        startDate: this.filterStartDate || null,
        endDate: this.filterEndDate || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private loadEvents(): void {
    this.organizerApi.searchOrganizerEvents({
      keyword: this.appliedKeyword || undefined,
      status: this.toApiStatus(this.selectedStatus),
      startDate: this.appliedStartDate,
      endDate: this.appliedEndDate,
      sort: 'DEFAULT',
      page: this.currentPage,
      pageSize: this.pageSize,
    }).subscribe((response) => {
      if (!isApiSuccessStatus(response.statusCode) || !response.data) return;
      this.serverTotalItems = response.data.totalCount;
      this.rows = response.data.events.items.map((event) => ({
        id: event.eventId,
        name: event.eventTitle,
        nameImage: event.coverImageUrl || 'assets/images/shared/no-image-placeholder.svg',
        date: `${this.formatApiDate(event.eventStartAt)} - ${this.formatApiDate(event.eventEndAt)}`,
        location: [event.city, event.district, event.locationName].filter(Boolean).join(' '),
        status: event.statusText,
        signupProgress: `${event.registeredCount} / ${event.capacity}`,
        signupProgressCurrent: event.registeredCount,
        signupProgressTotal: event.capacity,
        pendingReviewCount: String(event.pendingReviewCount),
        paidCount: String(event.paidCount),
        selectedCount: String(event.selectedCount),
        actionLabel: '查看',
      }));
      this.displayRows = this.rows.map((row) => this.toDisplayRow(row));
    });
  }

  private toApiStatus(status: string): string | undefined {
    const mapping = new Map<string, string>([
      [ActivityStatus.draft, 'DRAFT'],
      [ActivityStatus.pendingReview, 'PENDING_REVIEW'],
      [ActivityStatus.revisionRequired, 'REVISION_REQUIRED'],
      [ActivityStatus.mapBuilding, 'MAP_BUILDING'],
      [ActivityStatus.readyToPublish, 'READY_TO_PUBLISH'],
      [ActivityStatus.registrationOpen, 'REGISTRATION_OPEN'],
      [ActivityStatus.full, 'FULL'],
      [ActivityStatus.published, 'PUBLISHED'],
      [ActivityStatus.active, 'ACTIVE'],
      [ActivityStatus.ended, 'ENDED'],
      [ActivityStatus.unpublishRequested, 'UNPUBLISH_REQUESTED'],
      [ActivityStatus.unpublished, 'UNPUBLISHED'],
    ]);
    return mapping.get(status);
  }

  private formatApiDate(value: string): string {
    const date = value?.slice(0, 10);
    return date ? date.replaceAll('-', '/') : '';
  }

  /** 更新目前分頁顯示的資料。 */
  private updateDisplayRows(): void {
    const rows = this.filteredRows;
    const maxPage = Math.max(1, Math.ceil(rows.length / this.pageSize));
    this.currentPage = Math.min(Math.max(1, this.currentPage), maxPage);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayRows = rows
      .slice(startIndex, startIndex + this.pageSize)
      .map((row) => this.toDisplayRow(row));
  }

  /** 依活動狀態產生列表操作按鈕，避免列表按鈕和狀態規則不一致。 */
  private getRowActions(row: OrganizerEventRow): NonNullable<OrganizerEventRow['actions']> {
    switch (row.status) {
      case ActivityStatus.draft:
        return [
          { key: 'edit', label: '編輯', variant: 'outline' },
          {
            key: 'submit',
            label: '送出審核',
            variant: 'primary',
            disabled: !row.canSubmitReview,
            hint: row.canSubmitReview ? undefined : '請先完成所有必填資料後再送出審核',
          },
        ];
      case ActivityStatus.pendingReview:
        return [
          { key: 'withdraw', label: '撤回申請', variant: 'outline' },
          { key: 'view', label: '查看', variant: 'outline' },
        ];
      case ActivityStatus.revisionRequired:
        return [
          { key: 'edit', label: '編輯', variant: 'outline' },
          { key: 'resubmit', label: '重新送審', variant: 'primary' },
        ];
      case ActivityStatus.mapBuilding:
        return [{ key: 'view', label: '查看', variant: 'outline' }];
      case ActivityStatus.readyToPublish:
        return [
          { key: 'publish', label: '發布活動', variant: 'primary' },
          { key: 'view', label: '查看', variant: 'outline' },
        ];
      case ActivityStatus.registrationOpen:
      case ActivityStatus.full:
        return [
          { key: 'unpublish', label: '下架活動', variant: 'danger' },
          { key: 'view', label: '查看', variant: 'outline' },
        ];
      default:
        return [{ key: 'view', label: '查看', variant: 'outline' }];
    }
  }

  /** 列表顯示資料依狀態補齊操作按鈕與尚未產生的統計欄位。 */
  private toDisplayRow(row: OrganizerEventRow): OrganizerEventRow {
    const actions = this.getRowActions(row);
    const pendingStatisticStatuses = [
      ActivityStatus.pendingReview,
      ActivityStatus.revisionRequired,
      ActivityStatus.mapBuilding,
      ActivityStatus.readyToPublish,
      ActivityStatus.unpublished,
    ];

    if (row.status === ActivityStatus.draft) {
      return {
        ...row,
        signupProgress: '',
        pendingReviewCount: '',
        paidCount: '',
        selectedCount: '',
        actionLabel: actions[0]?.label ?? '查看',
        actions,
      };
    }

    return {
      ...row,
      signupProgress: pendingStatisticStatuses.includes(row.status) || row.signupProgress.startsWith('0 /')
        ? '-'
        : row.signupProgress,
      paidCount: pendingStatisticStatuses.includes(row.status) || row.paidCount === '0'
        ? '-'
        : row.paidCount,
      pendingReviewCount: pendingStatisticStatuses.includes(row.status) || row.pendingReviewCount === '0'
        ? '-'
        : row.pendingReviewCount,
      selectedCount: pendingStatisticStatuses.includes(row.status) || row.selectedCount === '0'
        ? '-'
        : row.selectedCount,
      actionLabel: actions[0]?.label ?? '查看',
      actions,
    };
  }
}

