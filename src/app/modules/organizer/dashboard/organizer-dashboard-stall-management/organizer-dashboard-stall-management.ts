import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { DashboardDataTable, DashboardTableAction, DashboardTableColumn } from '../../../shared/dashboard/dashboard-data-table/dashboard-data-table';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { Dropdown } from '../../../shared/dropdown/dropdown';

interface StallEvent {
  id: number;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  boothCount: number;
  availableBoothCount: number;
  selectedBoothCount: number;
  status: string;
  statusClass: string;
}

@Component({
  selector: 'app-organizer-dashboard-stall-management',
  imports: [FormsModule, DashboardDataTable, DashboardPagination, DateRangeSelector, Dropdown],
  templateUrl: './organizer-dashboard-stall-management.html',
  styleUrl: './organizer-dashboard-stall-management.scss',
})
export class OrganizerDashboardStallManagement implements OnInit {
  @ViewChild(DateRangeSelector) private dateRangeSelector?: DateRangeSelector;
  keyword = '';
  selectedStatus = '全部狀態';
  startDate = '';
  endDate = '';
  currentPage = 1;
  readonly pageSize = 6;
  private appliedKeyword = '';

  readonly columns: DashboardTableColumn[] = [
    { key: 'name', label: '活動名稱', type: 'imageText', width: '18%' },
    { key: 'date', label: '活動日期', nowrap: true, width: '16%' },
    { key: 'location', label: '活動地點', width: '20%' },
    { key: 'status', label: '活動狀態', type: 'status', align: 'center', width: '11%' },
    { key: 'boothCount', label: '攤位總數', align: 'center', nowrap: true, width: '9%' },
    { key: 'selectedBoothCount', label: '已選攤位數', align: 'center', nowrap: true, width: '9%' },
    { key: 'availableBoothCount', label: '可選攤位數', align: 'center', nowrap: true, width: '9%' },
    { key: 'action', label: '', type: 'action', align: 'end', width: '8%', actionMinWidth: '56px' },
  ];

  readonly statusOptions = ['全部狀態', '待發布', '報名中', '已額滿', '品牌已公開', '進行中', '已下架', '已結束'];
  readonly events: StallEvent[] = [
    { id: 1, name: '夏日綠意市集', image: 'assets/images/market/cards/market-card-01.png', startDate: '2026/07/18', endDate: '2026/07/20', location: '宜蘭縣宜蘭市 天天園森林廣場', boothCount: 150, availableBoothCount: 32, selectedBoothCount: 118, status: '待發布', statusClass: 'pending' },
    { id: 2, name: '貓貓森林市集', image: 'assets/images/market/cards/market-card-02.png', startDate: '2026/06/15', endDate: '2026/06/16', location: '新北市板橋區 新板特區公園', boothCount: 150, availableBoothCount: 18, selectedBoothCount: 132, status: '報名中', statusClass: 'open' },
    { id: 3, name: '文創手作市集', image: 'assets/images/market/cards/market-card-03.png', startDate: '2026/05/18', endDate: '2026/05/19', location: '台北市中山區 華山1914文創園區', boothCount: 200, availableBoothCount: 0, selectedBoothCount: 200, status: '已額滿', statusClass: 'full' },
    { id: 4, name: '秋日親子市集', image: 'assets/images/market/cards/market-card-04.png', startDate: '2025/09/20', endDate: '2025/09/21', location: '桃園市中壢區 青塘公園', boothCount: 200, availableBoothCount: 24, selectedBoothCount: 176, status: '品牌已公開', statusClass: 'public' },
    { id: 5, name: '暮光藝文市集', image: 'assets/images/market/cards/market-card-05.png', startDate: '2025/04/12', endDate: '2025/04/13', location: '高雄市鹽埕區 駁二藝術特區', boothCount: 160, availableBoothCount: 8, selectedBoothCount: 152, status: '進行中', statusClass: 'active' },
    { id: 6, name: '海風夜市集', image: 'assets/images/market/cards/market-card-06.png', startDate: '2025/03/01', endDate: '2025/03/02', location: '屏東縣東港鎮 大鵬灣濱灣公園', boothCount: 120, availableBoothCount: 15, selectedBoothCount: 105, status: '已下架', statusClass: 'offline' },
    { id: 7, name: '春日花草市集', image: 'assets/images/market/cards/market-card-07.png', startDate: '2025/02/14', endDate: '2025/02/15', location: '新竹市東區 護城河畔', boothCount: 100, availableBoothCount: 0, selectedBoothCount: 100, status: '已結束', statusClass: 'ended' },
  ];

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    this.keyword = this.route.snapshot.queryParamMap.get('keyword') ?? '';
    this.selectedStatus = this.route.snapshot.queryParamMap.get('status') ?? '全部狀態';
    this.startDate = this.route.snapshot.queryParamMap.get('startDate') ?? '';
    this.endDate = this.route.snapshot.queryParamMap.get('endDate') ?? '';
    this.currentPage = Math.max(1, Number(this.route.snapshot.queryParamMap.get('page')) || 1);
    this.appliedKeyword = this.keyword.trim().toLowerCase();
  }

  get filteredEvents(): StallEvent[] {
    return this.events.filter((event) => {
      const keywordMatch = !this.appliedKeyword || event.name.toLowerCase().includes(this.appliedKeyword);
      const statusMatch = this.selectedStatus === '全部狀態' || event.status === this.selectedStatus;
      const startMatch = !this.startDate || event.endDate.replaceAll('/', '-') >= this.startDate;
      const endMatch = !this.endDate || event.startDate.replaceAll('/', '-') <= this.endDate;
      return keywordMatch && statusMatch && startMatch && endMatch;
    });
  }

  get displayEvents(): StallEvent[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEvents.slice(start, start + this.pageSize);
  }

  get displayRows(): Record<string, unknown>[] {
    return this.displayEvents.map((event) => ({
      ...event,
      nameImage: event.image,
      date: `${event.startDate} - ${event.endDate}`,
      statusClass: `stall-status-${event.statusClass}`,
      actions: [{ key: 'view', label: '查看', variant: 'outline' }],
    }));
  }

  search(): void {
    const range = this.dateRangeSelector?.getTimeRange();
    if (range) {
      this.startDate = range.startDate ?? '';
      this.endDate = range.endDate ?? '';
    }
    this.appliedKeyword = this.keyword.trim().toLowerCase();
    this.currentPage = 1;
    this.syncQuery();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status || '全部狀態';
    this.search();
  }

  onTableAction(action: DashboardTableAction): void {
    this.viewDetail(action.row as unknown as StallEvent);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.syncQuery();
  }

  viewDetail(event: StallEvent): void {
    this.router.navigate(['/organizer/dash-board/stall/detail', event.id], {
      queryParams: { returnPage: this.currentPage, returnKeyword: this.keyword || null, returnStatus: this.selectedStatus || null },
      state: { event },
    });
  }

  private syncQuery(): void {
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true, queryParams: {
      page: this.currentPage, keyword: this.keyword || null, status: this.selectedStatus === '全部狀態' ? null : this.selectedStatus,
      startDate: this.startDate || null, endDate: this.endDate || null,
    }});
  }
}
