import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApplicationStatus } from '../../../../models/status/ApplicationStatus';
import { PaymentStatus } from '../../../../models/status/PaymentStatus';
import {
  DashboardDataTable,
  DashboardTableAction,
  DashboardTableColumn,
} from '../../../shared/dashboard/dashboard-data-table/dashboard-data-table';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { Dropdown } from '../../../shared/dropdown/dropdown';

interface CollectionRow {
  id: number;
  activity: string;
  activityImage: string;
  brandName: string;
  vendorName: string;
  paymentAmount: string;
  deposit: string;
  paidAt: string;
  registrationStatus: string;
  registrationStatusClass?: string;
  paymentStatus: string;
  paymentStatusClass?: string;
  actions?: {
    key: string;
    label: string;
    variant?: 'primary' | 'outline' | 'danger' | 'success' | 'muted';
  }[];
}

@Component({
  selector: 'app-organizer-dashboard-collection-management',
  imports: [FormsModule, DashboardDataTable, DashboardPagination, Dropdown, DateRangeSelector],
  templateUrl: './organizer-dashboard-collection-management.html',
  styleUrl: './organizer-dashboard-collection-management.scss',
})
export class OrganizerDashboardCollectionManagement implements OnInit {
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

  readonly statusOptions = [
    '全部狀態',
    PaymentStatus.pending,
    PaymentStatus.paid,
    PaymentStatus.failed,
    PaymentStatus.expired,
    PaymentStatus.refundRequested,
    PaymentStatus.refunding,
    PaymentStatus.refundFailed,
    PaymentStatus.refunded,
  ];

  columns: DashboardTableColumn[] = [
    { key: 'activity', label: '活動名稱', type: 'imageText', width: '16%' },
    { key: 'registrationStatus', label: '報名狀態', type: 'status', align: 'center', width: '10%' },
    { key: 'brandName', label: '品牌名稱', width: '10%' },
    { key: 'vendorName', label: '攤主姓名', width: '9%' },
    { key: 'paymentStatus', label: '付款狀態', type: 'status', align: 'center', width: '10%' },
    { key: 'paymentAmount', label: '付款金額', align: 'end', nowrap: true, width: '8%' },
    { key: 'deposit', label: '保證金', align: 'end', nowrap: true, width: '7%' },
    { key: 'paidAt', label: '付款時間', nowrap: true, width: '13%' },
    { key: 'action', label: '', type: 'action', align: 'end', width: '17%' },
  ];

  rows: CollectionRow[] = [
    {
      id: 1,
      activity: '貓貓森林市集',
      activityImage: 'assets/images/market/cards/market-card-01.png',
      brandName: '森林選物',
      vendorName: '林小森',
      paymentAmount: '$2,600',
      deposit: '$1,000',
      paidAt: '2026/06/01 14:30',
      registrationStatus: ApplicationStatus.pendingSelection,
      paymentStatus: PaymentStatus.paid,
    },
    {
      id: 2,
      activity: '草地野餐市集',
      activityImage: 'assets/images/market/cards/market-card-02.png',
      brandName: '草木手作',
      vendorName: '李小草',
      paymentAmount: '$2,600',
      deposit: '$1,000',
      paidAt: '2026/06/05 09:20',
      registrationStatus: ApplicationStatus.refundPending,
      paymentStatus: PaymentStatus.refundRequested,
    },
    {
      id: 3,
      activity: '文創手作市集',
      activityImage: 'assets/images/market/cards/market-card-03.png',
      brandName: '暖暖日常',
      vendorName: '陳暖暖',
      paymentAmount: '$2,600',
      deposit: '$2,000',
      paidAt: '2026/06/10 10:15',
      registrationStatus: ApplicationStatus.refunding,
      paymentStatus: PaymentStatus.refunding,
    },
    {
      id: 4,
      activity: '夏日綠意市集',
      activityImage: 'assets/images/market/cards/market-card-04.png',
      brandName: '綠光植栽',
      vendorName: '王綠光',
      paymentAmount: '$2,600',
      deposit: '$1,000',
      paidAt: '2026/05/28 16:40',
      registrationStatus: ApplicationStatus.pendingPayment,
      paymentStatus: PaymentStatus.pending,
    },
    {
      id: 5,
      activity: '聖誕市集',
      activityImage: 'assets/images/market/cards/market-card-05.png',
      brandName: '聖誕小物',
      vendorName: '張小聖',
      paymentAmount: '$2,600',
      deposit: '$1,000',
      paidAt: '2026/05/25 18:30',
      registrationStatus: ApplicationStatus.pendingPayment,
      paymentStatus: PaymentStatus.failed,
    },
    {
      id: 6,
      activity: '冬日暖心市集',
      activityImage: 'assets/images/market/cards/market-card-06.png',
      brandName: '植感生活',
      vendorName: '趙植感',
      paymentAmount: '$2,600',
      deposit: '$2,000',
      paidAt: '2026/05/18 11:05',
      registrationStatus: ApplicationStatus.cancelled,
      paymentStatus: PaymentStatus.expired,
    },
    {
      id: 7,
      activity: '花見小物市集',
      activityImage: 'assets/images/market/cards/market-card-07.png',
      brandName: '花見小物',
      vendorName: '花小見',
      paymentAmount: '$2,600',
      deposit: '$1,000',
      paidAt: '2026/05/26 13:40',
      registrationStatus: ApplicationStatus.refunding,
      paymentStatus: PaymentStatus.refundFailed,
    },
    {
      id: 8,
      activity: '秋日風格市集',
      activityImage: 'assets/images/market/cards/market-card-08.png',
      brandName: '毛孩日常',
      vendorName: '毛小日',
      paymentAmount: '$2,600',
      deposit: '$1,000',
      paidAt: '2026/05/15 15:45',
      registrationStatus: ApplicationStatus.refunded,
      paymentStatus: PaymentStatus.refunded,
    },
    {
      id: 9,
      activity: '夏日綠意市集',
      activityImage: 'assets/images/market/cards/market-card-09.png',
      brandName: '森林選物',
      vendorName: '林小森',
      paymentAmount: '$3,800',
      deposit: '$1,000',
      paidAt: '2026/06/03 18:30',
      registrationStatus: ApplicationStatus.depositReturned,
      paymentStatus: PaymentStatus.paid,
    },
  ];

  displayRows: CollectionRow[] = [];

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

  get filteredRows(): CollectionRow[] {
    return this.rows.filter((row) => {
      const matchesStatus = this.selectedStatus === '全部狀態' || row.paymentStatus === this.selectedStatus;
      const matchesKeyword =
        !this.appliedKeyword ||
        row.activity.toLocaleLowerCase().includes(this.appliedKeyword) ||
        row.brandName.toLocaleLowerCase().includes(this.appliedKeyword) ||
        row.vendorName.toLocaleLowerCase().includes(this.appliedKeyword);
      const paidDate = row.paidAt.slice(0, 10).replaceAll('/', '-');
      const matchesStartDate = !this.appliedStartDate || paidDate >= this.appliedStartDate;
      const matchesEndDate = !this.appliedEndDate || paidDate <= this.appliedEndDate;

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

  searchCollections(): void {
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

  onTableRowClick(row: Record<string, unknown>): void {
    this.onTableAction({ key: 'view', label: '查看', variant: 'outline', row });
  }

  onTableAction(action: DashboardTableAction): void {
    const row = action.row as unknown as CollectionRow;
    this.router.navigate(['/organizer/dash-board/collection/detail', row.id], {
      queryParams: {
        returnPage: this.currentPage,
        returnStatus: this.selectedStatus === '全部狀態' ? null : this.selectedStatus,
        action: action.key,
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
      registrationStatusClass: ApplicationStatus.getClass(row.registrationStatus),
      paymentStatusClass: PaymentStatus.getClass(row.paymentStatus),
      actions: this.getRowActions(row),
    }));
  }

  private getRowActions(row: CollectionRow): CollectionRow['actions'] {
    if (row.paymentStatus === PaymentStatus.refundRequested) {
      return [
        { key: 'refund-confirm', label: '退款確認', variant: 'primary' },
        { key: 'view', label: '查看', variant: 'outline' },
      ];
    }

    return [{ key: 'view', label: '查看', variant: 'outline' }];
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

