import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import {
  DashboardDataTable,
  DashboardTableAction,
  DashboardTableColumn,
} from '../../../shared/dashboard/dashboard-data-table/dashboard-data-table';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { Dropdown } from '../../../shared/dropdown/dropdown';

interface AccountRow {
  id: number;
  activity: string;
  activityImage: string;
  activityStatus: string;
  activityDate: string;
  paidBooths: string;
  grossAmount: string;
  refundAmount: string;
  returnedDeposit: string;
  forfeitedDeposit: string;
  netAmount: string;
  activityStatusClass?: string;
  actions?: {
    key: string;
    label: string;
    variant?: 'primary' | 'outline' | 'danger' | 'success' | 'muted';
  }[];
}

@Component({
  selector: 'app-organizer-dashboard-account-management',
  imports: [FormsModule, DashboardDataTable, DashboardPagination, Dropdown, DateRangeSelector],
  templateUrl: './organizer-dashboard-account-management.html',
  styleUrl: './organizer-dashboard-account-management.scss',
})
export class OrganizerDashboardAccountManagement implements OnInit {
  @ViewChild(DateRangeSelector) private dateRangeSelector?: DateRangeSelector;

  currentPage = 1;
  pageSize = 6;
  keyword = '';
  selectedStatus = '全部狀態';
  filterStartDate: string | null = null;
  filterEndDate: string | null = null;

  private appliedKeyword = '';
  private appliedStartDate: string | null = null;
  private appliedEndDate: string | null = null;

  readonly statusOptions = ActivityStatus.filterList;

  readonly columns: DashboardTableColumn[] = [
    { key: 'activity', label: '活動名稱', type: 'imageText', nowrap: true, minWidth: '178px' },
    { key: 'activityDate', label: '活動日期', nowrap: true, minWidth: '134px' },
    { key: 'activityStatus', label: '活動狀態', type: 'status', align: 'center', minWidth: '78px' },
    { key: 'paidBooths', label: '已付款攤位數', align: 'center', nowrap: true, minWidth: '96px' },
    { key: 'grossAmount', label: '收款總額', align: 'end', nowrap: true, minWidth: '78px' },
    { key: 'refundAmount', label: '退款總額', align: 'end', nowrap: true, minWidth: '72px' },
    { key: 'returnedDeposit', label: '已退保證金', align: 'end', nowrap: true, minWidth: '82px' },
    { key: 'forfeitedDeposit', label: '未退保證金', align: 'end', nowrap: true, minWidth: '82px' },
    { key: 'netAmount', label: '實收金額', align: 'end', nowrap: true, minWidth: '78px' },
    { key: 'action', label: '', type: 'action', align: 'end', minWidth: '72px' },
  ];

  readonly rows: AccountRow[] = [
    {
      id: 1,
      activity: '夏日綠意市集',
      activityImage: 'assets/images/market/cards/market-card-01.png',
      activityStatus: ActivityStatus.registrationOpen,
      activityDate: '2026/07/18 - 2026/07/19',
      paidBooths: '28 / 60',
      grossAmount: '$100,800',
      refundAmount: '$7,200',
      returnedDeposit: '$20,000',
      forfeitedDeposit: '$8,000',
      netAmount: '$73,600',
    },
    {
      id: 2,
      activity: '秋日手作市集',
      activityImage: 'assets/images/market/cards/market-card-02.png',
      activityStatus: ActivityStatus.readyToPublish,
      activityDate: '2026/09/12 - 2026/09/13',
      paidBooths: '35 / 70',
      grossAmount: '$156,400',
      refundAmount: '$12,000',
      returnedDeposit: '$28,000',
      forfeitedDeposit: '$6,000',
      netAmount: '$116,400',
    },
    {
      id: 3,
      activity: '聖誕暖心市集',
      activityImage: 'assets/images/market/cards/market-card-03.png',
      activityStatus: ActivityStatus.pendingReview,
      activityDate: '2026/12/19 - 2026/12/20',
      paidBooths: '42 / 80',
      grossAmount: '$203,600',
      refundAmount: '$18,400',
      returnedDeposit: '$36,000',
      forfeitedDeposit: '$4,000',
      netAmount: '$149,200',
    },
    {
      id: 4,
      activity: '新春年貨市集',
      activityImage: 'assets/images/market/cards/market-card-04.png',
      activityStatus: ActivityStatus.active,
      activityDate: '2027/02/06 - 2027/02/07',
      paidBooths: '30 / 60',
      grossAmount: '$128,000',
      refundAmount: '$8,000',
      returnedDeposit: '$24,000',
      forfeitedDeposit: '$2,000',
      netAmount: '$96,000',
    },
    {
      id: 5,
      activity: '春日花卉市集',
      activityImage: 'assets/images/market/cards/market-card-05.png',
      activityStatus: ActivityStatus.ended,
      activityDate: '2026/04/10 - 2026/04/11',
      paidBooths: '22 / 50',
      grossAmount: '$88,200',
      refundAmount: '$4,800',
      returnedDeposit: '$16,000',
      forfeitedDeposit: '$3,000',
      netAmount: '$67,400',
    },
    {
      id: 6,
      activity: '親子野餐市集',
      activityImage: 'assets/images/market/cards/market-card-06.png',
      activityStatus: ActivityStatus.revisionRequired,
      activityDate: '2026/05/23 - 2026/05/24',
      paidBooths: '18 / 40',
      grossAmount: '$72,400',
      refundAmount: '$2,000',
      returnedDeposit: '$12,000',
      forfeitedDeposit: '$1,000',
      netAmount: '$58,400',
    },
    {
      id: 7,
      activity: '文創設計市集',
      activityImage: 'assets/images/market/cards/market-card-07.png',
      activityStatus: ActivityStatus.published,
      activityDate: '2026/06/13 - 2026/06/14',
      paidBooths: '25 / 50',
      grossAmount: '$96,800',
      refundAmount: '$6,000',
      returnedDeposit: '$18,000',
      forfeitedDeposit: '$2,000',
      netAmount: '$70,800',
    },
    {
      id: 8,
      activity: '中秋賞月市集',
      activityImage: 'assets/images/market/cards/market-card-08.png',
      activityStatus: ActivityStatus.unpublished,
      activityDate: '2026/09/26 - 2026/09/27',
      paidBooths: '20 / 50',
      grossAmount: '$84,000',
      refundAmount: '$3,600',
      returnedDeposit: '$14,000',
      forfeitedDeposit: '$2,000',
      netAmount: '$66,400',
    },
  ];

  displayRows: AccountRow[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const pageFromUrl = Number(this.route.snapshot.queryParamMap.get('page'));
    const statusFromUrl = this.route.snapshot.queryParamMap.get('status') ?? '';
    this.keyword = this.route.snapshot.queryParamMap.get('keyword') ?? '';
    this.filterStartDate = this.route.snapshot.queryParamMap.get('startDate');
    this.filterEndDate = this.route.snapshot.queryParamMap.get('endDate');
    this.appliedKeyword = this.keyword.trim().toLocaleLowerCase();
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

  get filteredRows(): AccountRow[] {
    return this.rows.filter((row) => {
      const matchesStatus = this.selectedStatus === '全部狀態' || row.activityStatus === this.selectedStatus;
      const matchesKeyword = !this.appliedKeyword || row.activity.toLocaleLowerCase().includes(this.appliedKeyword);
      const [startDate, endDate] = row.activityDate.split(' - ').map((date) => date.replaceAll('/', '-'));
      const matchesStartDate = !this.appliedStartDate || endDate >= this.appliedStartDate;
      const matchesEndDate = !this.appliedEndDate || startDate <= this.appliedEndDate;

      return matchesStatus && matchesKeyword && matchesStartDate && matchesEndDate;
    });
  }

  get totalItems(): number {
    return this.filteredRows.length;
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.syncListQueryParams();
    this.updateDisplayRows();
  }

  searchAccounts(): void {
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
    this.appliedKeyword = this.keyword.trim().toLocaleLowerCase();
    this.appliedStartDate = startDate;
    this.appliedEndDate = endDate;
    this.currentPage = 1;
    this.syncListQueryParams();
    this.updateDisplayRows();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.syncListQueryParams();
    this.updateDisplayRows();
  }

  onTableAction(action: DashboardTableAction): void {
    const row = action.row as unknown as AccountRow;
    this.router.navigate(['/organizer/dash-board/account/detail', row.id], {
      queryParams: {
        returnPage: this.currentPage,
        returnStatus: this.selectedStatus === '全部狀態' ? null : this.selectedStatus,
      },
    });
  }

  private updateDisplayRows(): void {
    const rows = this.filteredRows;
    const maxPage = Math.max(1, Math.ceil(rows.length / this.pageSize));
    this.currentPage = Math.min(Math.max(1, this.currentPage), maxPage);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayRows = rows.slice(startIndex, startIndex + this.pageSize).map((row) => ({
      ...row,
      activityStatusClass: this.getStatusClass(row.activityStatus),
      actions: [{ key: 'view', label: '查看', variant: 'outline' }],
    }));
  }

  private getStatusClass(status: string): string {
    return ActivityStatus.getClass(status);
  }

  private syncListQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        status: this.selectedStatus === '全部狀態' ? null : this.selectedStatus,
        keyword: this.keyword.trim() || null,
        startDate: this.filterStartDate || null,
        endDate: this.filterEndDate || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}


