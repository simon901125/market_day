import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import type { MarketMapBooth, MarketMapData } from '../../../../models/interface/shared/MarketMap';
import { VendorStatus } from '../../../../models/status/VendorStatus';
import { DEFAULT_MARKET_MAP_DATA, MarketMap } from '../../../shared/market-map/market-map';

interface DaySelection {
  date: string;
  weekday: string;
  booth: MarketMapBooth | null;
  selectedAt: string | null;
}

@Component({
  selector: 'app-vendor-booth-selection',
  imports: [CommonModule, RouterLink, MarketMap],
  templateUrl: './vendor-booth-selection.html',
  styleUrl: './vendor-booth-selection.scss',
})
export class VendorBoothSelection {
  readonly vendorStatus = VendorStatus;
  readonly applicationNo: string;
  readonly days: DaySelection[] = [
    { date: '2026/07/18', weekday: '六', booth: null, selectedAt: null },
    { date: '2026/07/19', weekday: '日', booth: null, selectedAt: null },
  ];

  activeDayIndex = 0;
  viewMode = false;
  dialog: 'confirm' | 'success' | 'conflict' | null = null;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.applicationNo = this.route.snapshot.paramMap.get('applicationNo') ?? 'MD20260601001';
    this.viewMode = this.route.snapshot.queryParamMap.get('mode') === 'view';
    if (this.viewMode) {
      const dates = this.route.snapshot.queryParamMap.get('dates')?.split(',').filter(Boolean) ?? [];
      const boothCodes = this.route.snapshot.queryParamMap.get('booths')?.split(',').filter(Boolean) ?? [];
      const selectedTimes = this.route.snapshot.queryParamMap.get('selectedAt')?.split(',').filter(Boolean) ?? [];
      const viewDates = dates.length ? dates : ['2026/05/30', '2026/05/31'];
      const viewBooths = boothCodes.length ? boothCodes : ['A12', 'A12'];

      this.days.splice(0, this.days.length, ...viewDates.map((date, index) => ({
        date,
        weekday: this.getWeekday(date),
        booth: DEFAULT_MARKET_MAP_DATA.booths.find((booth) => booth.code === viewBooths[index]) ?? null,
        selectedAt: selectedTimes[index] ?? '2026/05/28 14:30',
      })));
    }
  }

  get activeDay(): DaySelection { return this.days[this.activeDayIndex]; }
  get allSelected(): boolean { return this.days.every((day) => day.booth); }

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

  selectBooth(booth: MarketMapBooth): void {
    if (this.viewMode || booth.status === 'occupied') return;
    this.activeDay.booth = booth;
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

  private getWeekday(date: string): string {
    const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
    return weekdayNames[new Date(`${date.replaceAll('/', '-')}T00:00:00`).getDay()];
  }

  backToDetail(): void {
    this.router.navigate(['/vendor/dash-board/application-record/detail', this.applicationNo]);
  }
}
