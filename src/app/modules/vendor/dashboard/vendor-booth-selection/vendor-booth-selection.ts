import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import type { MarketMapBooth, MarketMapData } from '../../../../models/interface/shared/MarketMap';
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
export class VendorBoothSelection {
  @ViewChild('marketMap') private marketMapComponent?: MarketMap;

  readonly vendorStatus = VendorStatus;
  readonly applicationNo: string;
  /** 返回報名詳情時使用的資料庫 applicationId。 */
  readonly applicationId: string;
  readonly days: DaySelection[] = [
    { date: '2026/07/18', booth: null, selectedAt: null },
    { date: '2026/07/19', booth: null, selectedAt: null },
  ];

  activeDayIndex = 0;
  viewMode = false;
  dialog: VendorBoothSelectionDialog | null = null;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.applicationNo = this.route.snapshot.paramMap.get('applicationNo') ?? 'MD20260601001';
    this.applicationId = this.route.snapshot.queryParamMap.get('applicationId') ?? this.applicationNo;
    this.viewMode = this.route.snapshot.queryParamMap.get('mode') === 'view';
    if (this.viewMode) {
      const dates = this.route.snapshot.queryParamMap.get('dates')?.split(',').filter(Boolean) ?? [];
      const boothCodes = this.route.snapshot.queryParamMap.get('booths')?.split(',').filter(Boolean) ?? [];
      const selectedTimes = this.route.snapshot.queryParamMap.get('selectedAt')?.split(',').filter(Boolean) ?? [];
      const viewDates = dates.length ? dates : ['2026/05/30', '2026/05/31'];
      const viewBooths = boothCodes.length ? boothCodes : ['A12', 'A12'];

      this.days.splice(0, this.days.length, ...viewDates.map((date, index) => ({
        date,
        booth: DEFAULT_MARKET_MAP_DATA.booths.find((booth) => booth.code === viewBooths[index]) ?? null,
        selectedAt: selectedTimes[index] ?? '2026/05/28 14:30',
      })));
    }
  }

  get activeDay(): DaySelection { return this.days[this.activeDayIndex]; }
  get allSelected(): boolean { return this.days.every((day) => day.booth); }
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
    if (this.viewMode || booth.status === 'occupied') return;
    this.activeDay.booth = booth;
  }

  handleFullscreenAction(): void {
    if (!this.activeDay.booth) {
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
    this.dialog = this.route.snapshot.queryParamMap.get('conflict') === 'true' ? 'conflict' : 'success';
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
}
