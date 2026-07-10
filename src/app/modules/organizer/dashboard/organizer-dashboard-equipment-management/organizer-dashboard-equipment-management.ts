import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import {
  DashboardDataTable,
  DashboardTableAction,
  DashboardTableColumn,
} from '../../../shared/dashboard/dashboard-data-table/dashboard-data-table';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { Dropdown } from '../../../shared/dropdown/dropdown';

interface EquipmentActivityRow {
  id: number;
  activity: string;
  activityImage: string;
  activityTime: string;
  activityStatus: string;
  registrationCount: string;
  baseEquipment: string;
  basePower: string;
  rentalEquipment: string;
  extraPower: string;
  vehicleRegistration: string;
  actions?: {
    key: string;
    label: string;
    variant?: 'primary' | 'outline' | 'danger' | 'success' | 'muted';
  }[];
}

@Component({
  selector: 'app-organizer-dashboard-equipment-management',
  imports: [FormsModule, RouterLink, DashboardDataTable, DashboardPagination, Dropdown, DateRangeSelector],
  templateUrl: './organizer-dashboard-equipment-management.html',
  styleUrl: './organizer-dashboard-equipment-management.scss',
})
export class OrganizerDashboardEquipmentManagement implements OnInit {
  @ViewChild(DateRangeSelector) private dateRangeSelector?: DateRangeSelector;

  currentPage = 1;
  pageSize = 6;
  keyword = '';
  selectedStatus = ActivityStatus.all;
  filterStartDate: string | null = null;
  filterEndDate: string | null = null;

  private appliedKeyword = '';
  private appliedStartDate: string | null = null;
  private appliedEndDate: string | null = null;

  readonly statusOptions = [
    ActivityStatus.all,
    ActivityStatus.active,
    '即將開始',
    ActivityStatus.pendingReview,
    ActivityStatus.registrationOpen,
    ActivityStatus.full,
    ActivityStatus.ended,
    ActivityStatus.unpublished,
  ];

  columns: DashboardTableColumn[] = [
    { key: 'activity', label: '活動名稱', type: 'imageText', minWidth: '172px' },
    { key: 'activityTime', label: '活動日期', minWidth: '148px', nowrap: true },
    { key: 'activityStatus', label: '活動狀態', type: 'status', align: 'center', minWidth: '88px' },
    { key: 'registrationCount', label: '報名攤數', align: 'center', minWidth: '72px', nowrap: true },
    { key: 'baseEquipment', label: '基本設備數', align: 'center', minWidth: '72px', nowrap: true },
    { key: 'basePower', label: '基本用電數', align: 'center', minWidth: '72px', nowrap: true },
    { key: 'rentalEquipment', label: '租借設備數', align: 'center', minWidth: '72px', nowrap: true },
    { key: 'extraPower', label: '額外用電數', align: 'center', minWidth: '72px', nowrap: true },
    { key: 'vehicleRegistration', label: '車牌登記數', align: 'center', minWidth: '72px', nowrap: true },
    { key: 'action', label: '', type: 'action', align: 'end', minWidth: '72px' },
  ];

  rows: EquipmentActivityRow[] = [
    {
      id: 1,
      activity: '森之夏日市集',
      activityImage: 'assets/images/market/cards/market-card-01.png',
      activityTime: '2025/07/18 - 2025/07/20',
      activityStatus: ActivityStatus.active,
      registrationCount: '142',
      baseEquipment: '130',
      basePower: '142',
      rentalEquipment: '186',
      extraPower: '26',
      vehicleRegistration: '118',
    },
    {
      id: 2,
      activity: '海風手作市集',
      activityImage: 'assets/images/market/cards/market-card-02.png',
      activityTime: '2025/08/08 - 2025/08/10',
      activityStatus: '即將開始',
      registrationCount: '96',
      baseEquipment: '96',
      basePower: '96',
      rentalEquipment: '114',
      extraPower: '18',
      vehicleRegistration: '72',
    },
    {
      id: 3,
      activity: '星光夜市集',
      activityImage: 'assets/images/market/cards/market-card-03.png',
      activityTime: '2025/06/20 - 2025/06/22',
      activityStatus: ActivityStatus.pendingReview,
      registrationCount: '65',
      baseEquipment: '65',
      basePower: '65',
      rentalEquipment: '82',
      extraPower: '12',
      vehicleRegistration: '58',
    },
    {
      id: 4,
      activity: '親子樂活市集',
      activityImage: 'assets/images/market/cards/market-card-04.png',
      activityTime: '2025/05/30 - 2025/06/01',
      activityStatus: ActivityStatus.registrationOpen,
      registrationCount: '88',
      baseEquipment: '88',
      basePower: '88',
      rentalEquipment: '106',
      extraPower: '14',
      vehicleRegistration: '60',
    },
    {
      id: 5,
      activity: '植感生活市集',
      activityImage: 'assets/images/market/cards/market-card-05.png',
      activityTime: '2025/09/12 - 2025/09/14',
      activityStatus: ActivityStatus.full,
      registrationCount: '160',
      baseEquipment: '160',
      basePower: '160',
      rentalEquipment: '234',
      extraPower: '28',
      vehicleRegistration: '152',
    },
    {
      id: 6,
      activity: '小島文創市集',
      activityImage: 'assets/images/market/cards/market-card-06.png',
      activityTime: '2025/04/26 - 2025/04/27',
      activityStatus: ActivityStatus.ended,
      registrationCount: '120',
      baseEquipment: '120',
      basePower: '120',
      rentalEquipment: '150',
      extraPower: '20',
      vehicleRegistration: '110',
    },
    {
      id: 7,
      activity: '秋日漫步市集',
      activityImage: 'assets/images/market/cards/market-card-07.png',
      activityTime: '2025/10/03 - 2025/10/05',
      activityStatus: ActivityStatus.unpublished,
      registrationCount: '-',
      baseEquipment: '-',
      basePower: '-',
      rentalEquipment: '-',
      extraPower: '-',
      vehicleRegistration: '-',
    },
    {
      id: 8,
      activity: '海岸風格市集',
      activityImage: 'assets/images/market/cards/market-card-08.png',
      activityTime: '2025/03/14 - 2025/03/16',
      activityStatus: ActivityStatus.ended,
      registrationCount: '100',
      baseEquipment: '100',
      basePower: '100',
      rentalEquipment: '128',
      extraPower: '18',
      vehicleRegistration: '96',
    },
    {
      id: 9,
      activity: '城市森林市集',
      activityImage: 'assets/images/market/cards/market-card-09.png',
      activityTime: '2025/11/08 - 2025/11/09',
      activityStatus: ActivityStatus.registrationOpen,
      registrationCount: '74',
      baseEquipment: '74',
      basePower: '74',
      rentalEquipment: '92',
      extraPower: '11',
      vehicleRegistration: '48',
    },
  ];

  displayRows: EquipmentActivityRow[] = [];

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

  get filteredRows(): EquipmentActivityRow[] {
    return this.rows.filter((row) => {
      const matchesStatus = this.selectedStatus === ActivityStatus.all || row.activityStatus === this.selectedStatus;
      const matchesKeyword = !this.appliedKeyword || row.activity.toLocaleLowerCase().includes(this.appliedKeyword);
      const startDate = row.activityTime.slice(0, 10).replaceAll('/', '-');
      const matchesStartDate = !this.appliedStartDate || startDate >= this.appliedStartDate;
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

  searchEquipmentActivities(): void {
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
    const row = action.row as unknown as EquipmentActivityRow;
    this.router.navigate(['/organizer/dash-board/equipment/detail', row.id], {
      queryParams: {
        returnPage: this.currentPage,
        returnStatus: this.selectedStatus === ActivityStatus.all ? null : this.selectedStatus,
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
    if (status === '即將開始') {
      return 'tag-orange';
    }

    return ActivityStatus.getClass(status);
  }

  private syncListQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        status: this.selectedStatus === ActivityStatus.all ? null : this.selectedStatus,
        keyword: this.keyword.trim() || null,
        startDate: this.filterStartDate || null,
        endDate: this.filterEndDate || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

