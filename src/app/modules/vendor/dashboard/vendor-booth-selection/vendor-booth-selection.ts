import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { VendorService } from '../../../../core/Vendor/vendorApi/vendor.service';
import { AlertService } from '../../../../core/services/alert.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import type { MarketMapBooth, MarketMapData } from '../../../../models/interface/shared/MarketMap';
import type { VendorMarketDetail } from '../../../../models/interface/vendor/VendorMarketDetail';
import { VendorStatus } from '../../../../models/status/VendorStatus';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { DEFAULT_MARKET_MAP_DATA, MarketMap } from '../../../shared/market-map/market-map';
import {
  VendorBoothSelectionDialog,
  VendorBoothSelectionModal,
} from '../modals/vendor-booth-selection-modal/vendor-booth-selection-modal';

interface DaySelection {
  date: string;
  booth: MarketMapBooth | null;
  selectedAt: string | null;
}

@Component({
  selector: 'app-vendor-booth-selection',
  imports: [CommonModule, RouterLink, MarketMap, Dropdown, VendorBoothSelectionModal],
  templateUrl: './vendor-booth-selection.html',
  styleUrl: './vendor-booth-selection.scss',
})
export class VendorBoothSelection implements OnInit {
  @ViewChild('marketMap') private marketMapComponent?: MarketMap;

  readonly vendorStatus = VendorStatus;
  readonly applicationNo: string;
  /** 返回報名詳情時使用的資料庫 applicationId。 */
  readonly applicationId: string;
  readonly days: DaySelection[] = [];

  activityTitle = '';
  activityDateText = '';
  activityAddress = '';
  boothTotal = 0;
  isLoading = true;

  activeDayIndex = 0;
  viewMode = false;
  isSubmitting = false;
  dialog: VendorBoothSelectionDialog | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly vendorDashboardService: VendorDashboardService,
    private readonly vendorService: VendorService,
    private readonly alert: AlertService,
  ) {
    this.applicationNo = this.route.snapshot.paramMap.get('applicationNo') ?? 'MD20260601001';
    this.applicationId = this.route.snapshot.queryParamMap.get('applicationId') ?? this.applicationNo;
    this.viewMode = this.route.snapshot.queryParamMap.get('mode') === 'view';
  }

  ngOnInit(): void {
    const applicationId = Number(this.applicationId);
    if (!Number.isInteger(applicationId) || applicationId < 1) {
      this.isLoading = false;
      void this.alert.error('活動資訊載入失敗', '報名資料不正確，無法取得活動資訊。');
      return;
    }

    this.vendorDashboardService.getVendorApplicationDetail(applicationId).subscribe({
      next: (response) => {
        if (!isApiSuccessStatus(response.statusCode) || !response.data?.event?.eventId) {
          this.handleActivityLoadFailure(response.message);
          return;
        }

        this.loadActivity(response.data.event.eventId);
      },
      error: () => this.handleActivityLoadFailure(),
    });
  }

  get activeDay(): DaySelection | undefined { return this.days[this.activeDayIndex]; }
  get allSelected(): boolean { return this.days.length > 0 && this.days.every((day) => day.booth); }
  get dateOptions(): string[] { return this.days.map((day) => day.date); }

  get mapData(): MarketMapData {
    const selectedCode = this.activeDay?.booth?.code;
    return {
      ...DEFAULT_MARKET_MAP_DATA,
      booths: DEFAULT_MARKET_MAP_DATA.booths.map((booth, index) => ({
        ...booth,
        brand: undefined,
        status: booth.id === 'service-booth'
          ? 'occupied'
          : booth.code === selectedCode
            ? 'selected'
            : index % 7 === 2 || ['A11', 'B03'].includes(booth.code)
              ? 'occupied'
              : 'available',
      })),
    };
  }

  selectDay(index: number): void { this.activeDayIndex = index; }

  selectDayByDate(date: string): void {
    const index = this.days.findIndex((day) => day.date === date);
    if (index >= 0) this.selectDay(index);
  }

  selectBooth(booth: MarketMapBooth): void {
    const activeDay = this.activeDay;
    if (!activeDay || this.viewMode || booth.status === 'occupied') return;
    activeDay.booth = booth;
  }

  handleFullscreenAction(): void {
    if (!this.activeDay?.booth) {
      return;
    }

    if (this.allSelected) {
      this.marketMapComponent?.closeFullscreenMap();
      this.requestComplete();
      return;
    }

    const nextUnselectedIndex = this.days.findIndex((day) => !day.booth);
    if (nextUnselectedIndex >= 0) {
      this.selectDay(nextUnselectedIndex);
    }
  }

  requestComplete(): void {
    if (!this.allSelected) return;
    this.dialog = 'confirm';
  }

  confirmComplete(): void {
    if (!this.allSelected || this.isSubmitting) return;

    this.isSubmitting = true;
    // 畫面以 yyyy/MM/dd 顯示，送後端前轉成 LocalDate 可解析的 yyyy-MM-dd。
    const request = {
      applicationNo: this.applicationNo,
      selections: this.days.map((day) => ({
        applyDate: day.date.replaceAll('/', '-'),
        stallNo: day.booth!.code,
      })),
    };

    this.vendorDashboardService.selectEventStall(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (isApiSuccessStatus(response.statusCode)) {
          this.dialog = 'success';
          return;
        }

        this.handleSelectionFailure(response.message);
      },
      error: () => {
        this.isSubmitting = false;
        this.dialog = null;
        void this.alert.error('攤位選擇失敗', '無法連線至伺服器，請稍後再試。');
      },
    });
  }

  retrySelection(): void {
    this.days.forEach((day) => {
      day.booth = null;
      day.selectedAt = null;
    });
    this.activeDayIndex = 0;
    this.dialog = null;
  }

  closeDialog(): void { this.dialog = null; }

  backToDetail(): void {
    this.router.navigate(['/vendor/dash-board/application-record/detail', this.applicationId]);
  }

  private loadActivity(eventId: number): void {
    this.vendorService.getMarketDetail(eventId).subscribe({
      next: (response) => {
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          this.handleActivityLoadFailure(response.message);
          return;
        }

        this.applyActivity(response.data);
        this.isLoading = false;
      },
      error: () => this.handleActivityLoadFailure(),
    });
  }

  private applyActivity(activity: VendorMarketDetail): void {
    this.activityTitle = activity.eventTitle;
    this.activityDateText = this.formatActivityDateTime(activity.startAt, activity.endAt);
    this.activityAddress = activity.locationName || activity.address;
    this.boothTotal = activity.dailyAvailability[0]?.totalStalls ?? activity.maxBooths;

    const viewDates = this.route.snapshot.queryParamMap.get('dates')?.split(',').filter(Boolean) ?? [];
    const boothCodes = this.route.snapshot.queryParamMap.get('booths')?.split(',').filter(Boolean) ?? [];
    const selectedTimes = this.route.snapshot.queryParamMap.get('selectedAt')?.split(',') ?? [];
    const viewSelectionByDate = new Map(viewDates.map((date, index) => [
      this.normalizeDate(date),
      { boothCode: boothCodes[index], selectedAt: selectedTimes[index] || null },
    ]));

    const activityDates = activity.dailyAvailability.map((item) => item.applyDate).filter(Boolean);
    this.days.splice(0, this.days.length, ...activityDates.map((date) => {
      const viewSelection = viewSelectionByDate.get(this.normalizeDate(date));
      return {
        date,
        booth: this.viewMode && viewSelection?.boothCode
          ? DEFAULT_MARKET_MAP_DATA.booths.find((booth) => booth.code === viewSelection.boothCode) ?? null
          : null,
        selectedAt: this.viewMode ? viewSelection?.selectedAt ?? null : null,
      };
    }));
    this.activeDayIndex = 0;
  }

  private formatActivityDateTime(startAt: string, endAt: string): string {
    const startDate = startAt.slice(0, 10).replaceAll('-', '/');
    const endDate = endAt.slice(0, 10).replaceAll('-', '/');
    const startTime = startAt.slice(11, 16);
    const endTime = endAt.slice(11, 16);
    return `${startDate} - ${endDate}　${startTime} - ${endTime}`;
  }

  private normalizeDate(date: string): string {
    return date.replaceAll('/', '-');
  }

  private handleActivityLoadFailure(message = ''): void {
    this.isLoading = false;
    void this.alert.error('活動資訊載入失敗', message || '無法取得活動資訊，請稍後再試。');
  }

  /** 攤位被搶先選走時導向重選流程，其他業務錯誤則顯示後端訊息。 */
  private handleSelectionFailure(message: string): void {
    const isStallConflict = message.includes('已被選走') || message.includes('不可選擇');
    if (isStallConflict) {
      this.dialog = 'conflict';
      return;
    }

    this.dialog = null;
    void this.alert.error('攤位選擇失敗', message || '請稍後再試。');
  }
}
