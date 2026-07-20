import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AlertService } from '../../../../core/services/alert.service';
import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import {
  OrganizerStallDetailResponse,
  OrganizerStallMapItem,
  OrganizerStallMapResponse,
} from '../../../../models/interface/organizer/OrganizerOperations';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { BoothStatus } from '../../../../models/status/BoothStatus';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { Dropdown } from '../../../shared/dropdown/dropdown';

interface BoothRow { code: string; zone: string; size: string; selected: boolean; brand: string; category: string; vendor: string; selectedAt: string; }

@Component({ selector: 'app-organizer-dashboard-stall-detail', imports: [DatePipe, FormsModule, RouterLink, DashboardPagination, Dropdown], templateUrl: './organizer-dashboard-stall-detail.html', styleUrl: './organizer-dashboard-stall-detail.scss' })
/** 活動攤位詳情頁，提供日期、攤位狀態篩選及已選攤位品牌資料。 */
export class OrganizerDashboardStallDetail implements OnInit {
  readonly boothStatus = BoothStatus;
  eventId = 0;
  selectedDate = '';
  activeTab: 'all' | 'available' | 'selected' = 'all';
  keyword = '';
  currentPage = 1;
  readonly pageSize = 5;
  dates: string[] = [];
  booths: BoothRow[] = [];
  selectedStallDetail: OrganizerStallDetailResponse | null = null;
  brandLoadingStallNo: string | null = null;
  event = {
    title: '-', image: 'assets/images/market/cards/market-card-01.png', status: '-', statusClass: 'tag-grey',
    date: '-', location: '-', address: '-', total: 0, selected: 0, available: 0,
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organizerApi: OrganizerApiService,
    private readonly alert: AlertService,
  ) {}

  /** 取得活動編號與返回頁碼，再載入攤位清單。 */
  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentPage = Math.max(1, Number(this.route.snapshot.queryParamMap.get('page')) || 1);
    if (this.eventId > 0) void this.loadMap();
  }

  get filteredBooths(): BoothRow[] {
    const key = this.keyword.trim().toLowerCase();
    return this.booths.filter((booth) =>
      (this.activeTab === 'all' || (this.activeTab === 'selected') === booth.selected)
      && (!key || `${booth.code}${booth.brand}`.toLowerCase().includes(key))
    );
  }

  get displayBooths(): BoothRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBooths.slice(start, start + this.pageSize);
  }

  count(type: 'all'|'available'|'selected'): number {
    if (type === 'all') return this.event.total;
    return type === 'selected' ? this.event.selected : this.event.available;
  }

  setTab(tab: 'all'|'available'|'selected'): void { this.activeTab = tab; this.currentPage = 1; }
  onPageChange(page: number): void { this.currentPage = page; }
  selectDate(date: string): void { this.selectedDate = date; this.currentPage = 1; void this.loadMap(); }

  /** 查詢已選攤位的品牌資料，供桌機版側欄與行動版視窗共用。 */
  async openBrandDetail(booth: BoothRow): Promise<void> {
    if (!booth.selected || this.brandLoadingStallNo) return;

    this.brandLoadingStallNo = booth.code;
    try {
      const response = await firstValueFrom(
        this.organizerApi.getOrganizerStallDetail(
          this.eventId,
          booth.code,
          this.selectedDate.replaceAll('/', '-') || undefined,
        ),
      );

      if (!isApiSuccessStatus(response.statusCode)) {
        await this.alert.error(
          '無法查看品牌',
          response.message || '品牌資料讀取失敗，請稍後再試。',
        );
        return;
      }

      if (!response.data?.vendor) {
        await this.alert.error('無法查看品牌', '這個攤位目前沒有可顯示的品牌資料。');
        return;
      }

      this.selectedStallDetail = response.data;
    } catch (error: unknown) {
      const requestError = error as { error?: { message?: string } };
      await this.alert.error(
        '無法查看品牌',
        requestError.error?.message || '品牌資料讀取失敗，請稍後再試。',
      );
    } finally {
      this.brandLoadingStallNo = null;
    }
  }

  closeBrandDetail(): void {
    this.selectedStallDetail = null;
  }

  openBoothMap(): void {
    this.router.navigate(['/organizer/dash-board/stall/detail', this.eventId, 'map'], {
      queryParams: { applyDate: this.selectedDate, returnPage: this.route.snapshot.queryParamMap.get('returnPage'), returnKeyword: this.route.snapshot.queryParamMap.get('returnKeyword'), returnStatus: this.route.snapshot.queryParamMap.get('returnStatus') },
    });
  }

  goBack(): void {
    this.router.navigate(['/organizer/dash-board/stall'], { queryParams: { page: this.route.snapshot.queryParamMap.get('returnPage'), keyword: this.route.snapshot.queryParamMap.get('returnKeyword'), status: this.route.snapshot.queryParamMap.get('returnStatus') } });
  }

  /** 依選擇日期重新查詢攤位狀態與統計。 */
  private async loadMap(): Promise<void> {
    try {
      const response = await firstValueFrom(this.organizerApi.getOrganizerStallMap(this.eventId, { applyDate: this.selectedDate.replaceAll('/', '-') || undefined }));
      this.applyResponse(response.data);
    } catch {
      this.booths = [];
    }
  }

  /** 將攤位地圖 API 回應整理為頁面標頭、日期與表格資料。 */
  private applyResponse(data: OrganizerStallMapResponse): void {
    const e = data.event;
    this.dates = this.enumerateDates(e.startAt, e.endAt);
    this.selectedDate = (e.currentApplyDate || this.selectedDate || this.dates[0] || '').replaceAll('-', '/');
    const status = ActivityStatus.fromApiStatus(e.eventStatus || '');
    this.event = {
      ...this.event,
      title: e.eventTitle || '-', status, statusClass: ActivityStatus.getClass(status),
      date: this.formatRange(e.startAt, e.endAt), location: e.locationName || '-', address: e.address || '-',
      total: e.totalStallCount ?? 0, selected: e.selectedStallCount ?? 0, available: e.availableStallCount ?? 0,
    };
    this.booths = (data.stalls ?? []).flatMap((zone) => (zone.stalls ?? []).map((stall) => this.mapBooth(stall, zone.zoneName)));
  }

  private mapBooth(stall: OrganizerStallMapItem, zoneName: string): BoothRow {
    const vendor = stall.selectedVendor;
    return {
      code: stall.stallNo,
      zone: zoneName || '-',
      size: stall.length && stall.width ? `${stall.length}m × ${stall.width}m` : '-',
      selected: stall.status === '已選擇' || stall.status === '系統分配',
      brand: vendor?.name || '-', category: vendor?.category?.name || '-', vendor: vendor?.ownerName || '-',
      selectedAt: this.formatDateTime(vendor?.selectedAt),
    };
  }

  private enumerateDates(startAt: string, endAt: string): string[] {
    const start = new Date(startAt); const end = new Date(endAt); const dates: string[] = [];
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
    for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) dates.push(this.dateOnly(date));
    return dates;
  }

  private formatRange(startAt: string, endAt: string): string {
    const start = new Date(startAt); const end = new Date(endAt);
    return Number.isNaN(start.getTime()) ? '-' : `${this.dateOnly(start)} - ${this.dateOnly(end)}`;
  }

  private dateOnly(date: Date): string { return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }); }
  private formatDateTime(value: string | null | undefined): string { const d = value ? new Date(value) : null; return d && !Number.isNaN(d.getTime()) ? d.toLocaleString('zh-TW', { hour12: false }) : '-'; }
}
