import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { OrganizerEventRow } from '../../../../models/interface/organizer/OrganizerEventRow';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { DashboardDataTable, DashboardTableAction, DashboardTableColumn } from '../../../shared/dashboard/dashboard-data-table/dashboard-data-table';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { Dropdown } from '../../../shared/dropdown/dropdown';

@Component({
  selector: 'app-organizer-event-management',
  imports: [FormsModule, DashboardDataTable, DashboardPagination, Dropdown, DateRangeSelector, RouterLink],
  templateUrl: './organizer-event-management.html',
  styleUrl: './organizer-event-management.scss',
})
export class OrganizerEventManagement implements OnInit {
  @ViewChild(DateRangeSelector) private dateRangeSelector?: DateRangeSelector;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  currentPage = 1;
  pageSize = 6;
  selectedStatus = '';
  searchKeyword = '';
  filterStartDate: string | null = null;
  filterEndDate: string | null = null;
  private appliedKeyword = '';
  private appliedStartDate: string | null = null;
  private appliedEndDate: string | null = null;

  readonly statusOptions = ActivityStatus.filterList;

  columns: DashboardTableColumn[] = [
    { key: 'name', label: '活動名稱', type: 'imageText' },
    { key: 'date', label: '活動日期' },
    { key: 'location', label: '活動地點' },
    { key: 'status', label: '狀態', type: 'status', align: 'center' },
    { key: 'signupProgress', label: '報名進度', align: 'center' },
    { key: 'paidCount', label: '已付款', align: 'center' },
    { key: 'action', label: '操作', type: 'action', align: 'center' },
  ];

  rows: OrganizerEventRow[] = [
    {
      id: 1,
      name: '夏日綠意市集',
      nameImage: 'assets/images/market/cards/market-card-01.png',
      date: '2026/06/15 - 2026/06/21',
      location: '台北市 信義區',
      status: ActivityStatus.active,
      signupProgress: '128 / 150',
      paidCount: '118',
      actionLabel: '查看詳情',
    },
    {
      id: 2,
      name: '週末文創手作市集',
      nameImage: 'assets/images/market/cards/market-card-02.png',
      date: '2026/06/27 - 2026/06/28',
      location: '台北市 中正區',
      status: ActivityStatus.registrationOpen,
      signupProgress: '96 / 120',
      paidCount: '82',
      actionLabel: '查看詳情',
    },
    {
      id: 3,
      name: '親子野餐選物日',
      nameImage: 'assets/images/market/cards/market-card-03.png',
      date: '2026/07/04 - 2026/07/05',
      location: '新北市 板橋區',
      status: ActivityStatus.full,
      signupProgress: '100 / 100',
      paidCount: '96',
      actionLabel: '查看詳情',
    },
    {
      id: 4,
      name: '河岸品牌公開展',
      nameImage: 'assets/images/market/cards/market-card-04.png',
      date: '2026/07/18 - 2026/07/19',
      location: '桃園市 中壢區',
      status: ActivityStatus.published,
      signupProgress: '64 / 90',
      paidCount: '58',
      actionLabel: '查看詳情',
    },
    {
      id: 5,
      name: '秋季地圖建置活動',
      nameImage: 'assets/images/market/cards/market-card-05.png',
      date: '2026/08/01 - 2026/08/02',
      location: '台中市 西區',
      status: ActivityStatus.mapBuilding,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 6,
      name: '城市待審核市集',
      nameImage: 'assets/images/market/cards/market-card-06.png',
      date: '2026/08/15 - 2026/08/16',
      location: '台南市 中西區',
      status: ActivityStatus.pendingReview,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 7,
      name: '草稿活動範例',
      nameImage: 'assets/images/market/cards/market-card-07.png',
      date: '2026/09/05 - 2026/09/06',
      location: '高雄市 鹽埕區',
      status: ActivityStatus.draft,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 8,
      name: '補件中活動範例',
      nameImage: 'assets/images/market/cards/market-card-08.png',
      date: '2026/09/19 - 2026/09/20',
      location: '台北市 松山區',
      status: ActivityStatus.revisionRequired,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 9,
      name: '待發布活動範例',
      nameImage: 'assets/images/market/cards/market-card-09.png',
      date: '2026/10/03 - 2026/10/04',
      location: '新竹市 東區',
      status: ActivityStatus.readyToPublish,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 10,
      name: '已下架活動範例',
      nameImage: 'assets/images/market/cards/market-card-10.png',
      date: '2026/11/14 - 2026/11/15',
      location: '台中市 北區',
      status: ActivityStatus.unpublished,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 11,
      name: '春日手作回顧',
      nameImage: 'assets/images/user/activity/history/history-market-01.png',
      date: '2025/04/12 - 2025/04/13',
      location: '台北市 大安區',
      status: ActivityStatus.ended,
      signupProgress: '80 / 80',
      paidCount: '80',
      actionLabel: '查看詳情',
    },
  ];

  displayRows: OrganizerEventRow[] = [];

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

    this.updateDisplayRows();
  }

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

  get totalItems(): number {
    return this.filteredRows.length;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.syncListQueryParams();
    this.updateDisplayRows();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status === ActivityStatus.all ? '' : status;
    this.currentPage = 1;
    this.syncListQueryParams();
    this.updateDisplayRows();
  }

  /** 目前先以前端資料篩選；串接 API 後可在此改為傳送查詢條件。 */
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
    this.updateDisplayRows();
  }

  onTableAction(action: DashboardTableAction): void {
    const activity = action.row as unknown as OrganizerEventRow;
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

  private updateDisplayRows(): void {
    const rows = this.filteredRows;
    const maxPage = Math.max(1, Math.ceil(rows.length / this.pageSize));
    this.currentPage = Math.min(Math.max(1, this.currentPage), maxPage);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayRows = rows.slice(startIndex, startIndex + this.pageSize);
  }
}
