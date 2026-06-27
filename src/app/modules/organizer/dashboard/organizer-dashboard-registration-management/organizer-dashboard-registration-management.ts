import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  OrganizerRegistrationAction,
  OrganizerRegistrationRow,
} from '../../../../models/interface/organizer/OrganizerRegistrationRow';
import { ApplicationStatus } from '../../../../models/status/ApplicationStatus';
import {
  DashboardDataTable,
  DashboardTableAction,
  DashboardTableColumn,
} from '../../../shared/dashboard/dashboard-data-table/dashboard-data-table';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { Dropdown } from '../../../shared/dropdown/dropdown';

@Component({
  selector: 'app-organizer-dashboard-registration-management',
  imports: [FormsModule, DashboardDataTable, DashboardPagination, Dropdown, DateRangeSelector],
  templateUrl: './organizer-dashboard-registration-management.html',
  styleUrl: './organizer-dashboard-registration-management.scss',
})
export class OrganizerDashboardRegistrationManagement implements OnInit {
  @ViewChild(DateRangeSelector) private dateRangeSelector?: DateRangeSelector;

  currentPage = 1;
  pageSize = 6;

  // 狀態篩選預設直接顯示全部狀態，避免下拉出現空白或 placeholder 狀態。
  selectedStatus = ApplicationStatus.all;
  searchActivityKeyword = '';
  searchBrandKeyword = '';
  filterStartDate: string | null = null;
  filterEndDate: string | null = null;

  // 搜尋列輸入時不即時篩選，按下搜尋後才同步到 applied 條件。
  private appliedActivityKeyword = '';
  private appliedBrandKeyword = '';
  private appliedStartDate: string | null = null;
  private appliedEndDate: string | null = null;

  readonly statusOptions = ApplicationStatus.filterList;

  columns: DashboardTableColumn[] = [
    { key: 'activity', label: '活動名稱', type: 'imageText' },
    { key: 'activityTime', label: '活動日期', nowrap: true },
    { key: 'brandName', label: '品牌名稱' },
    { key: 'brandType', label: '品牌類型' },
    { key: 'vendorName', label: '攤主姓名' },
    { key: 'registeredAt', label: '報名時間' },
    { key: 'status', label: '狀態', type: 'status', align: 'center' },
    { key: 'action', label: '操作', type: 'action', align: 'center' },
  ];

  // 報名管理目前使用靜態資料展示，內容需對齊活動管理與使用者市集活動資料。
  rows: OrganizerRegistrationRow[] = [
    {
      id: 1,
      activity: '夏日綠意市集',
      activityImage: 'assets/images/market/cards/market-card-01.png',
      activityTime: '2026/06/15 - 2026/06/21',
      brandName: '森森選物',
      vendorName: '林小森',
      brandType: '文創手作',
      registeredAt: '2026/06/01 14:30',
      status: ApplicationStatus.pendingReview,
      actions: [
        { key: 'review', label: '審核', variant: 'primary' },
      ],
    },
    {
      id: 2,
      activity: '職人咖啡生活市集',
      activityImage: 'assets/images/market/cards/market-card-02.png',
      activityTime: '2026/06/27 - 2026/06/28',
      brandName: '毛孩日常',
      vendorName: '陳小米',
      brandType: '寵物生活',
      registeredAt: '2026/06/01 10:15',
      status: ApplicationStatus.reviewRejected,
      actions: [{ key: 'view', label: '查看' }],
    },
    {
      id: 3,
      activity: '衣著選物週末',
      activityImage: 'assets/images/market/cards/market-card-03.png',
      activityTime: '2026/07/04 - 2026/07/05',
      brandName: '慢日子',
      vendorName: '黃慢慢',
      brandType: '文創手作',
      registeredAt: '2026/05/31 16:45',
      status: ApplicationStatus.pendingPayment,
      actions: [{ key: 'view', label: '查看' }],
    },
    {
      id: 4,
      activity: '風格選物生活節',
      activityImage: 'assets/images/market/cards/market-card-04.png',
      activityTime: '2026/07/18 - 2026/07/19',
      brandName: '植感生活',
      vendorName: '周植植',
      brandType: '植物選物',
      registeredAt: '2026/05/30 09:20',
      status: ApplicationStatus.pendingSelection,
      actions: [
        { key: 'refund', label: '退款', variant: 'primary' },
      ],
    },
    {
      id: 5,
      activity: '毛孩友善市集',
      activityImage: 'assets/images/market/cards/market-card-05.png',
      activityTime: '2026/08/01 - 2026/08/02',
      brandName: '小日子手作',
      vendorName: '張小日',
      brandType: '文創手作',
      registeredAt: '2026/05/29 13:50',
      status: ApplicationStatus.refundPending,
      actions: [
        { key: 'go-payment', label: '前往收款管理', variant: 'primary' },
      ],
    },
    {
      id: 6,
      activity: '植感生活市集',
      activityImage: 'assets/images/market/cards/market-card-06.png',
      activityTime: '2026/08/15 - 2026/08/16',
      brandName: '山系日常',
      vendorName: '吳小山',
      brandType: '文創手作',
      registeredAt: '2026/05/28 11:20',
      status: ApplicationStatus.completed,
      actions: [
        this.createDepositReturnAction('2026/08/15 - 2026/08/16'),
      ],
    },
    {
      id: 7,
      activity: '烘焙陶作午後市集',
      activityImage: 'assets/images/market/cards/market-card-07.png',
      activityTime: '2026/09/05 - 2026/09/06',
      brandName: '好好生活',
      vendorName: '李好好',
      brandType: '生活選物',
      registeredAt: '2026/05/27 15:10',
      status: ApplicationStatus.refunding,
      actions: [{ key: 'view', label: '查看' }],
    },
    {
      id: 8,
      activity: '草地親子手作日',
      activityImage: 'assets/images/market/cards/market-card-08.png',
      activityTime: '2026/09/19 - 2026/09/20',
      brandName: '簡單手作',
      vendorName: '簡小單',
      brandType: '文創手作',
      registeredAt: '2026/05/25 18:30',
      status: ApplicationStatus.refunded,
      actions: [{ key: 'view', label: '查看' }],
    },
    {
      id: 9,
      activity: '月光手作夜市集',
      activityImage: 'assets/images/market/cards/market-card-09.png',
      activityTime: '2026/10/03 - 2026/10/04',
      brandName: '拾甜甜點',
      vendorName: '王小拾',
      brandType: '餐飲美食',
      registeredAt: '2026/05/24 12:10',
      status: ApplicationStatus.cancelled,
      actions: [{ key: 'view', label: '查看' }],
    },
    {
      id: 10,
      activity: '海風編織選物市集',
      activityImage: 'assets/images/market/cards/market-card-10.png',
      activityTime: '2026/11/14 - 2026/11/15',
      brandName: '木作小室',
      vendorName: '許木木',
      brandType: '文創手作',
      registeredAt: '2026/05/22 09:40',
      status: ApplicationStatus.pendingReview,
      actions: [
        { key: 'review', label: '審核', variant: 'primary' },
      ],
    },
    {
      id: 11,
      activity: '春日野餐市集',
      activityImage: 'assets/images/market/cards/market-card-11.png',
      activityTime: '2026/04/11 - 2026/04/12',
      brandName: '花見小物',
      vendorName: '林花見',
      brandType: '生活選物',
      registeredAt: '2026/04/01 09:30',
      status: ApplicationStatus.depositReturned,
      actions: [{ key: 'view', label: '查看' }],
    },
  ];

  displayRows: OrganizerRegistrationRow[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const pageFromUrl = Number(this.route.snapshot.queryParamMap.get('page'));
    const statusFromUrl = this.route.snapshot.queryParamMap.get('status') ?? '';
    this.searchActivityKeyword = this.route.snapshot.queryParamMap.get('activity') ?? '';
    this.searchBrandKeyword = this.route.snapshot.queryParamMap.get('brand') ?? '';
    this.filterStartDate = this.route.snapshot.queryParamMap.get('startDate');
    this.filterEndDate = this.route.snapshot.queryParamMap.get('endDate');
    this.appliedActivityKeyword = this.searchActivityKeyword.trim().toLocaleLowerCase();
    this.appliedBrandKeyword = this.searchBrandKeyword.trim().toLocaleLowerCase();
    this.appliedStartDate = this.filterStartDate;
    this.appliedEndDate = this.filterEndDate;

    if (Number.isInteger(pageFromUrl) && pageFromUrl > 0) {
      this.currentPage = pageFromUrl;
    }

    if (this.statusOptions.includes(statusFromUrl)) {
      this.selectedStatus = statusFromUrl;
    }

    this.updateDisplayRows();
  }

  // 依已套用的搜尋條件產生列表資料，避免使用者還在輸入時畫面一直變動。
  get filteredRows(): OrganizerRegistrationRow[] {
    return this.rows.filter((row) => {
      const matchesStatus = this.selectedStatus === ApplicationStatus.all || row.status === this.selectedStatus;
      const matchesActivity =
        !this.appliedActivityKeyword || row.activity.toLocaleLowerCase().includes(this.appliedActivityKeyword);
      const matchesBrand =
        !this.appliedBrandKeyword || row.brandName.toLocaleLowerCase().includes(this.appliedBrandKeyword);
      const registeredDate = row.registeredAt.slice(0, 10).replaceAll('/', '-');
      const matchesStartDate = !this.appliedStartDate || registeredDate >= this.appliedStartDate;
      const matchesEndDate = !this.appliedEndDate || registeredDate <= this.appliedEndDate;
      return matchesStatus && matchesActivity && matchesBrand && matchesStartDate && matchesEndDate;
    });
  }

  get totalItems(): number {
    return this.filteredRows.length;
  }

  // 保證金退回只有活動進行中可以操作，其餘時間顯示停用狀態。
  private createDepositReturnAction(activityTime: string): OrganizerRegistrationAction {
    const isEnabled = this.isActivityInProgress(activityTime);

    return {
      key: 'deposit-return',
      label: '退還保證金',
      variant: isEnabled ? 'primary' : 'muted',
      disabled: !isEnabled,
      hint: isEnabled ? undefined : '報名場次結束後才可退還',
    };
  }

  private isActivityInProgress(activityTime: string): boolean {
    const [startText, endText] = activityTime.split(' - ');
    const startDate = this.parseActivityDate(startText, false);
    const endDate = this.parseActivityDate(endText, true);
    const today = new Date();

    return today >= startDate && today <= endDate;
  }

  private parseActivityDate(dateText: string, isEndDate: boolean): Date {
    const [year, month, day] = dateText.split('/').map(Number);
    const hour = isEndDate ? 23 : 0;
    const minute = isEndDate ? 59 : 0;
    const second = isEndDate ? 59 : 0;

    return new Date(year, month - 1, day, hour, minute, second);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.syncListQueryParams();
    this.updateDisplayRows();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.syncListQueryParams();
    this.updateDisplayRows();
  }

  // 按下搜尋後才正式套用活動、品牌、報名日期篩選。
  searchRegistrations(): void {
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
    this.appliedActivityKeyword = this.searchActivityKeyword.trim().toLocaleLowerCase();
    this.appliedBrandKeyword = this.searchBrandKeyword.trim().toLocaleLowerCase();
    this.appliedStartDate = startDate;
    this.appliedEndDate = endDate;
    this.currentPage = 1;
    this.syncListQueryParams();
    this.updateDisplayRows();
  }

  // 列表操作統一導到報名詳情，並保留目前頁碼與狀態方便返回。
  onTableAction(action: DashboardTableAction): void {
    const registration = action.row as unknown as OrganizerRegistrationRow;
    this.router.navigate(['/organizer/dash-board/register/detail', registration.id], {
      queryParams: {
        returnPage: this.currentPage,
        returnStatus: this.selectedStatus === ApplicationStatus.all ? null : this.selectedStatus,
        action: action.key,
      },
    });
  }

  // 將目前列表條件同步到網址，重整或從詳情返回時可以保留操作位置。
  private syncListQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        status: this.selectedStatus === ApplicationStatus.all ? null : this.selectedStatus,
        activity: this.searchActivityKeyword.trim() || null,
        brand: this.searchBrandKeyword.trim() || null,
        startDate: this.filterStartDate || null,
        endDate: this.filterEndDate || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  // 依篩選結果重新切分目前頁面要顯示的 6 筆資料。
  private updateDisplayRows(): void {
    const rows = this.filteredRows;
    const maxPage = Math.max(1, Math.ceil(rows.length / this.pageSize));
    this.currentPage = Math.min(Math.max(1, this.currentPage), maxPage);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayRows = rows
      .slice(startIndex, startIndex + this.pageSize)
      .map((row) => this.toDisplayRow(row));
  }

  /** 依報名狀態產生列表操作按鈕，避免每筆假資料各自維護造成不一致。 */
  private getRowActions(row: OrganizerRegistrationRow): OrganizerRegistrationAction[] {
    switch (row.status) {
      case ApplicationStatus.pendingReview:
        return [{ key: 'review', label: '審核', variant: 'primary' }];
      case ApplicationStatus.completed:
        return [this.createDepositReturnAction(row.activityTime)];
      case ApplicationStatus.refundPending:
        return [{ key: 'refund-confirm', label: '前往退款確認', variant: 'primary' }];
      default:
        return [{ key: 'view', label: '查看', variant: 'outline' }];
    }
  }

  private toDisplayRow(row: OrganizerRegistrationRow): OrganizerRegistrationRow {
    return {
      ...row,
      actions: this.getRowActions(row),
    };
  }
}
